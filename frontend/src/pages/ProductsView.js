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
import Navbar from '../components/Navbar';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
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
    <div className="app-shell">
      <Navbar />
      <main className="page">

        <div className="page-header">
          <h1>Products</h1>
          <p>Top 10 products by revenue</p>
        </div>

        <div className="filter-bar">
          <label htmlFor="products-from">From</label>
          <input id="products-from" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <label htmlFor="products-to">To</label>
          <input id="products-to" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button className="btn-apply" onClick={loadData}>Apply</button>
        </div>

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}

        {loading && <div className="loading">Loading products data…</div>}

        {!loading && !error && (
          <>
            {/* ── Top products bar chart ───────────────────────────────── */}
            <div className="card highlight">
              <div className="section-title">Top 10 Products by Revenue</div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 16px' }}>
                {startDate} to {endDate} • Revenue in USD
              </p>
              {chartData.length === 0 ? (
                <div className="loading">No products found for the selected date range.</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                    <XAxis dataKey="short_name" tick={axisTick} stroke={colors.grid} interval={0} />
                    <YAxis tickFormatter={formatCurrency} tick={axisTick} stroke={colors.grid} />
                    <Tooltip
                      formatter={(value) => [formatFull(value), 'Revenue']}
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

            {/* ── Products table ───────────────────────────────────────── */}
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>Product Details</div>
              {products.length === 0 ? (
                <div className="loading">No products found for the selected date range.</div>
              ) : (
                <div className="table-wrap">
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
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
