/**
 * ProductsView.js — Product Performance page
 * Shows top 10 products bar chart + details table.
 * Fully responsive with Tailwind CSS.
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import { getProducts } from '../utils/dataSource';
import { useTheme } from '../utils/ThemeContext';
import { getChartTheme } from '../utils/chartTheme';

function formatCompact(value) {
  if (!value) return '$0';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(2)}`;
}
function formatFull(value) {
  return `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
function truncate(text, max = 16) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default function ProductsView() {
  const { dark } = useTheme();
  const { colors, axisTick, tooltipStyle } = getChartTheme(dark);

  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  async function loadData() {
    if (startDate > endDate) {
      setError('"From" date must be on or before "To" date.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(startDate, endDate);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products data', err);
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  const chartData = products.slice(0, 10).map(p => ({ ...p, short_name: truncate(p.name) }));

  const card = `bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)]
                p-4 sm:p-5 shadow-[var(--shadow)] mb-5`;

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="text-[clamp(26px,2vw+18px,38px)] font-bold leading-tight text-brand">Products</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Top 10 products by revenue</p>
        </div>

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <div className={`${card} flex flex-wrap items-center gap-3`}>
          <label htmlFor="products-from" className="text-sm font-semibold text-[var(--text-secondary)]">From</label>
          <input
            id="products-from" type="date" value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-md
                       px-2.5 py-1.5 text-sm text-[var(--text-primary)] min-w-0"
          />
          <label htmlFor="products-to" className="text-sm font-semibold text-[var(--text-secondary)]">To</label>
          <input
            id="products-to" type="date" value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-md
                       px-2.5 py-1.5 text-sm text-[var(--text-primary)] min-w-0"
          />
          <button
            onClick={loadData}
            className="bg-brand text-white rounded-md px-4 py-1.5 text-sm font-semibold
                       cursor-pointer hover:opacity-85 transition-opacity"
          >
            Apply
          </button>
        </div>

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}

        {loading && (
          <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
            Loading products data…
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Bar chart ───────────────────────────────────────────────── */}
            <div className={`${card} border-[var(--accent)] border-[1.5px]`}>
              <div className="text-lg font-bold text-brand">Top 10 Products by Revenue</div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 mb-4">
                {startDate} to {endDate} · Revenue in USD
              </p>
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
                  No products found for the selected date range.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                    <XAxis
                      dataKey="short_name"
                      tick={{ ...axisTick, fontSize: 11 }}
                      stroke={colors.grid}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                    />
                    <YAxis tickFormatter={formatCompact} tick={axisTick} stroke={colors.grid} />
                    <Tooltip
                      formatter={(v) => [formatFull(v), 'Revenue']}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.name || label}
                      contentStyle={tooltipStyle}
                      cursor={{ fill: colors.cursor }}
                    />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {chartData.map((p, i) => (
                        <Cell key={p.product_id} fill={i === 0 ? colors.highlight : colors.bar} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ── Table ───────────────────────────────────────────────────── */}
            <div className={card}>
              <div className="text-lg font-bold text-brand mb-4">Product Details</div>
              {products.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
                  No products found for the selected date range.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm text-[var(--text-primary)]">
                    <thead>
                      <tr>
                        {['Product Name', 'Category', 'Units Sold', 'Revenue'].map((h, i) => (
                          <th
                            key={h}
                            scope="col"
                            className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide
                                        text-[var(--text-muted)] border-b border-[var(--border)] whitespace-nowrap
                                        ${i >= 2 ? 'text-right' : 'text-left'}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.product_id} className="hover:bg-brand/5 transition-colors">
                          <td className="px-3 py-2.5 border-b border-[var(--border)]">{p.name}</td>
                          <td className="px-3 py-2.5 border-b border-[var(--border)]">{p.category}</td>
                          <td className="px-3 py-2.5 border-b border-[var(--border)] text-right">
                            {Number(p.units_sold).toLocaleString('en-US')}
                          </td>
                          <td className="px-3 py-2.5 border-b border-[var(--border)] text-right font-bold text-brand">
                            {formatFull(p.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
