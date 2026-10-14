/**
 * OrdersView.js — Orders Overview page (Figma: Dashboard/Orders)
 *
 * This page shows:
 *   - Stat cards: total revenue and total orders for the selected date range
 *     (summed from the monthly data), plus unique customers
 *   - A bar chart of revenue by city (top 10)
 *   - A smooth area chart of monthly revenue
 *   - A date range filter with an Apply button
 *
 * Data comes from utils/dataSource (dummy data by default, see REACT_APP_USE_MOCK).
 */

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import PageShell from '../components/PageShell';
import DateRangeFilter from '../components/DateRangeFilter';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import useMediaQuery from '../utils/useMediaQuery';
import { getSummary, getOrders, getCities } from '../utils/dataSource';
import { useTheme } from '../utils/ThemeContext';
import { getChartTheme } from '../utils/chartTheme';

// Full currency, e.g. $4,968,800
function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// Compact currency for chart axes, e.g. $430K / $1.2M
function formatCompact(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000)    return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function OrdersView() {
  const { dark } = useTheme();
  const { colors, axisTick, tooltipStyle } = getChartTheme(dark);
  const isPhone = useMediaQuery('(max-width: 639px)');
  const chartHeight = isPhone ? 260 : 340;

  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');
  const [summary,   setSummary]   = useState(null);
  const [orders,    setOrders]    = useState([]);
  const [cities,    setCities]    = useState([]);
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

  // Stat cards follow the date range: sum the monthly rows returned for it
  const totalRevenue = orders.reduce((sum, m) => sum + Number(m.revenue || 0), 0);
  const totalOrders  = orders.reduce((sum, m) => sum + Number(m.order_count || 0), 0);

  // Short month labels ("January" -> "Jan") so axis labels never overlap
  const monthlyData = orders.map(m => ({ ...m, month_label: String(m.month_name).slice(0, 3) }));
  const topCities   = cities.slice(0, 10).map(c => ({ ...c, label: `${c.city}, ${c.state}` }));

  const tooltipFormatter = (value) => [formatCurrency(value), 'Revenue'];

  return (
    <PageShell title="Orders" subtitle="Revenue and order volume">
        <DateRangeFilter
          idPrefix="orders"
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onApply={loadData}
        />

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}

        {loading && <div className="loading">Loading orders data…</div>}

        {!loading && !error && (
          <>
            {/* ── Stat cards: stacked on phones, 3 across from sm ─────── */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="stat-box">
                <span className="stat-dot bg-accent" aria-hidden="true" />
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">{formatCurrency(totalRevenue)}</div>
                <div className="stat-sub">{startDate} to {endDate}</div>
              </div>
              <div className="stat-box">
                <span className="stat-dot bg-[#FF5A5F]" aria-hidden="true" />
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{totalOrders.toLocaleString('en-US')}</div>
                <div className="stat-sub">{startDate} to {endDate}</div>
              </div>
              <div className="stat-box">
                <span className="stat-dot bg-brand" aria-hidden="true" />
                <div className="stat-label">Unique Customers</div>
                <div className="stat-value">{Number(summary?.unique_customers || 0).toLocaleString('en-US')}</div>
                <div className="stat-sub">All-time</div>
              </div>
            </div>

            {/* ── Charts: stacked on phones/tablets, side by side from lg ── */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="card">
                <div className="section-title mb-4">Revenue by City (Top 10)</div>
                {topCities.length === 0 ? (
                  <div className="loading">No city data found for the selected date range.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart data={topCities} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                      <XAxis type="number" tickFormatter={formatCompact} tick={axisTick} stroke={colors.grid} />
                      <YAxis type="category" dataKey="label" width={isPhone ? 92 : 120} tick={axisTick} stroke={colors.grid} interval={0} />
                      <Tooltip formatter={tooltipFormatter} contentStyle={tooltipStyle} cursor={{ fill: colors.cursor }} />
                      <Bar dataKey="revenue" fill={colors.bar} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="card">
                <div className="section-title mb-4">Monthly Revenue</div>
                {monthlyData.length === 0 ? (
                  <div className="loading">No orders found for the selected date range.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <AreaChart data={monthlyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="monthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={colors.bar} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={colors.bar} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                      <XAxis dataKey="month_label" tick={axisTick} stroke={colors.grid} interval={isPhone ? 1 : 0} />
                      <YAxis tickFormatter={formatCompact} tick={axisTick} stroke={colors.grid} />
                      <Tooltip
                        formatter={tooltipFormatter}
                        contentStyle={tooltipStyle}
                        cursor={{ stroke: colors.bar, strokeOpacity: 0.3 }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke={colors.bar} strokeWidth={2} fill="url(#monthGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
    </PageShell>
  );
}
