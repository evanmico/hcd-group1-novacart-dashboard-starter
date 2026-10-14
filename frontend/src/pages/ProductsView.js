/**
 * ProductsView.js — Product Performance page (Figma: Dashboard/Products)
 *
 * This page shows:
 *   - A vertical bar chart of top 10 products by revenue (top product in teal)
 *   - A table with product name, category, units sold, and revenue
 *   - A date range filter
 *
 * Data comes from utils/dataSource (dummy data by default, see REACT_APP_USE_MOCK).
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import PageShell from '../components/PageShell';
import DateRangeFilter from '../components/DateRangeFilter';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import useMediaQuery from '../utils/useMediaQuery';
import { getProducts } from '../utils/dataSource';
import { useTheme } from '../utils/ThemeContext';
import { getChartTheme } from '../utils/chartTheme';

// Compact currency for chart axes, e.g. $90K / $1.2M
function formatCurrency(value) {
  if (!value) return '$0';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000)    return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(2)}`;
}

// Full currency for tooltip and table, e.g. $89,600
function formatFull(value) {
  return `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// Shorten long product names so they fit under the bars
function truncate(text, max = 20) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default function ProductsView() {
  const { dark } = useTheme();
  const { colors, axisTick, tooltipStyle } = getChartTheme(dark);
  // Phones: horizontal bars (names read left-to-right, as in the Figma mobile frame)
  const isPhone = useMediaQuery('(max-width: 639px)');

  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Load once on mount; later reloads happen via the Apply button
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

  return (
    <PageShell title="Products" subtitle="Top 10 products by revenue">
        <DateRangeFilter
          idPrefix="products"
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onApply={loadData}
        />

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}

        {loading && <div className="loading">Loading products data…</div>}

        {!loading && !error && (
          <>
            {/* ── Top products bar chart ───────────────────────────────── */}
            <div className="card highlight">
              <div className="section-title">Top 10 Products by Revenue</div>
              <p className="mb-4 mt-0.5 text-xs text-muted">
                {startDate} to {endDate} • Revenue in USD
              </p>
              {chartData.length === 0 ? (
                <div className="loading">No products found for the selected date range.</div>
              ) : (
                <ResponsiveContainer width="100%" height={isPhone ? 380 : 320}>
                  <BarChart
                    data={chartData}
                    layout={isPhone ? 'vertical' : 'horizontal'}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={isPhone} horizontal={!isPhone} />
                    {isPhone ? (
                      <>
                        <XAxis type="number" tickFormatter={formatCurrency} tick={axisTick} stroke={colors.grid} />
                        <YAxis type="category" dataKey="short_name" width={104} tick={axisTick} stroke={colors.grid} interval={0} />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="short_name" tick={axisTick} stroke={colors.grid} interval={0} />
                        <YAxis tickFormatter={formatCurrency} tick={axisTick} stroke={colors.grid} />
                      </>
                    )}
                    <Tooltip
                      formatter={(value) => [formatFull(value), 'Revenue']}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.name || label}
                      contentStyle={tooltipStyle}
                      cursor={{ fill: colors.cursor }}
                    />
                    <Bar dataKey="revenue" radius={isPhone ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
                      {chartData.map((p, i) => (
                        <Cell key={p.product_id} fill={i === 0 ? colors.highlight : colors.bar} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ── Products table ───────────────────────────────────────── */}
            <div className="card">
              <div className="section-title mb-4">Product Details</div>
              {products.length === 0 ? (
                <div className="loading">No products found for the selected date range.</div>
              ) : (
                <>
                {/* Phones: one card per product (name, category, units sold, revenue) */}
                <ul className="m-0 flex list-none flex-col gap-3 p-0 md:hidden">
                  {products.map(p => (
                    <li key={p.product_id} className="list-card !shadow-none">
                      <div className="font-semibold text-ink">{p.name}</div>
                      <div className="text-sm text-muted">{p.category}</div>
                      <dl className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <dt className="list-label">Units Sold</dt>
                          <dd className="m-0 font-semibold text-ink">{Number(p.units_sold).toLocaleString('en-US')}</dd>
                        </div>
                        <div>
                          <dt className="list-label">Revenue</dt>
                          <dd className="m-0 font-bold text-brand">{formatFull(p.revenue)}</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>

                {/* md and up: full table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Product Name</th>
                        <th scope="col">Category</th>
                        <th scope="col" className="num">Units Sold</th>
                        <th scope="col" className="num">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.product_id}>
                          <td>{p.name}</td>
                          <td>{p.category}</td>
                          <td className="num">{Number(p.units_sold).toLocaleString('en-US')}</td>
                          <td className="num revenue">{formatFull(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
              )}
            </div>
          </>
        )}
    </PageShell>
  );
}
