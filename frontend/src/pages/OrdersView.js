/**
 * OrdersView.js — Orders Overview page
 * Shows stat cards, revenue by city bar chart, monthly revenue area chart,
 * and a date range filter. Fully responsive with Tailwind CSS.
 */

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import { getSummary, getOrders, getCities } from '../utils/dataSource';
import { useTheme } from '../utils/ThemeContext';
import { getChartTheme } from '../utils/chartTheme';

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
function formatCompact(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export default function OrdersView() {
  const { dark } = useTheme();
  const { colors, axisTick, tooltipStyle } = getChartTheme(dark);

  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');
  const [summary,   setSummary]   = useState(null);
  const [orders,    setOrders]    = useState([]);
  const [cities,    setCities]    = useState([]);
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
      const [s, o, c] = await Promise.all([
        getSummary(),
        getOrders(startDate, endDate),
        getCities(startDate, endDate),
      ]);
      setSummary(s);
      setOrders(o);
      setCities(c);
    } catch (err) {
      console.error('Failed to load orders data', err);
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue = orders.reduce((sum, m) => sum + Number(m.revenue    || 0), 0);
  const totalOrders  = orders.reduce((sum, m) => sum + Number(m.order_count|| 0), 0);
  const monthlyData  = orders.map(m => ({ ...m, month_label: String(m.month_name).slice(0, 3) }));
  const topCities    = cities.slice(0, 10).map(c => ({ ...c, label: `${c.city}, ${c.state}` }));
  const tooltipFmt   = (v) => [formatCurrency(v), 'Revenue'];

  // Shared card style
  const card = `bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)]
                p-4 sm:p-5 shadow-[var(--shadow)] mb-5`;

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="text-[clamp(26px,2vw+18px,38px)] font-bold leading-tight text-brand">Orders</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Revenue and order volume</p>
        </div>

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <div className={`${card} flex flex-wrap items-center gap-3`}>
          <label htmlFor="orders-from" className="text-sm font-semibold text-[var(--text-secondary)]">From</label>
          <input
            id="orders-from" type="date" value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-md
                       px-2.5 py-1.5 text-sm text-[var(--text-primary)] min-w-0"
          />
          <label htmlFor="orders-to" className="text-sm font-semibold text-[var(--text-secondary)]">To</label>
          <input
            id="orders-to" type="date" value={endDate}
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
            Loading orders data…
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Stat cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {[
                { dot: 'bg-accent',       label: 'Total Revenue',     value: formatCurrency(totalRevenue), sub: `${startDate} to ${endDate}` },
                { dot: 'bg-[#FF5A5F]',   label: 'Total Orders',      value: totalOrders.toLocaleString('en-US'), sub: `${startDate} to ${endDate}` },
                { dot: 'bg-brand',        label: 'Unique Customers',  value: Number(summary?.unique_customers || 0).toLocaleString('en-US'), sub: 'All-time' },
              ].map(({ dot, label, value, sub }) => (
                <div key={label} className={`${card} relative mb-0`}>
                  <span className={`absolute top-4 right-4 w-3 h-3 rounded-full ${dot}`} aria-hidden="true" />
                  <div className="text-sm font-semibold text-[var(--text-secondary)] mb-1">{label}</div>
                  <div className="text-[clamp(22px,1.5vw+16px,30px)] font-bold text-[var(--text-primary)] leading-tight">{value}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1.5">{sub}</div>
                </div>
              ))}
            </div>

            {/* ── Charts ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

              {/* Revenue by City */}
              <div className={card}>
                <div className="text-lg font-bold text-brand mb-4">Revenue by City (Top 10)</div>
                {topCities.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
                    No city data found for the selected date range.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={topCities} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                      <XAxis type="number" tickFormatter={formatCompact} tick={axisTick} stroke={colors.grid} />
                      <YAxis type="category" dataKey="label" width={110} tick={axisTick} stroke={colors.grid} interval={0} />
                      <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={{ fill: colors.cursor }} />
                      <Bar dataKey="revenue" fill={colors.bar} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Monthly Revenue */}
              <div className={card}>
                <div className="text-lg font-bold text-brand mb-4">Monthly Revenue</div>
                {monthlyData.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
                    No orders found for the selected date range.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={340}>
                    <AreaChart data={monthlyData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="monthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={colors.bar} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={colors.bar} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                      <XAxis dataKey="month_label" tick={axisTick} stroke={colors.grid} interval={0} />
                      <YAxis tickFormatter={formatCompact} tick={axisTick} stroke={colors.grid} />
                      <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={{ stroke: colors.bar, strokeOpacity: 0.3 }} />
                      <Area type="monotone" dataKey="revenue" stroke={colors.bar} strokeWidth={2} fill="url(#monthGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
