import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import { getOrders, getCities } from '../utils/dataSource';
import { useTheme } from '../utils/ThemeContext';
import { getChartTheme } from '../utils/chartTheme';
import { useDateRange } from '../utils/DateRangeContext';
import barsIcon from '../assets/icons/bars.svg';
import revChartIcon from '../assets/icons/revenue_chart.svg';
import revenueIcon from '../assets/icons/revenue.svg';

function formatCurrency(v) {
  return `$${Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
function formatCompact(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

const CARD = 'bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-5 shadow-[var(--shadow)]';
const INPUT_CLS = 'bg-[var(--bg-primary)] border border-[var(--border)] rounded-md px-3 py-1.5 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--blue)]';

export default function OrdersView() {
  const { dark } = useTheme();
  const { colors, axisTick, tooltipStyle } = getChartTheme(dark);
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

  const [orders, setOrders] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cityChartType, setCityChartType] = useState('bar');
  const [monthlyChartType, setMonthlyChartType] = useState('line');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  async function loadData() {
    if (startDate > endDate) { setError('"From" must be on or before "To".'); return; }
    setLoading(true); setError(null);
    try {
      const [o, c] = await Promise.all([
        getOrders(startDate, endDate),
        getCities(startDate, endDate),
      ]);
      setOrders(o);
      setCities(c);
      setSelectedState('');
    } catch (err) {
      console.error(err); setError(LOAD_ERROR_MESSAGE);
    } finally { setLoading(false); }
  }

  const totalRevenue = orders.reduce((s, m) => s + Number(m.revenue     || 0), 0);
  const totalOrders  = orders.reduce((s, m) => s + Number(m.order_count || 0), 0);
  const monthlyData  = orders.map(m => ({ ...m, label: String(m.month_name).slice(0, 3) }));

  // Build states list from cities data for the dropdown
  const stateOptions = useMemo(() => {
    const seen = new Set();
    cities.forEach(c => seen.add(c.state));
    return ['All States', ...Array.from(seen).sort()];
  }, [cities]);

  // Revenue by City: filtered by state if selected, showing top cities
  const filteredCities = useMemo(() => {
    if (!selectedState) return cities.slice(0, 10);
    return cities.filter(c => c.state === selectedState).slice(0, 10);
  }, [cities, selectedState]);

  const revenueByCityData = useMemo(() => {
    return filteredCities.map(c => ({
      ...c,
      label: c.city,
    }));
  }, [filteredCities]);

  const tooltipFmt = (v) => [formatCurrency(v), 'Revenue'];

  const statCards = [
    {
      iconSrc: barsIcon,
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      sub: 'Delivered + Shipped orders only',
    },
    {
      iconSrc: revChartIcon,
      label: 'Total Orders',
      value: totalOrders.toLocaleString('en-US'),
      sub: 'Delivered + Shipped orders only',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 min-w-0 px-6 py-7">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[var(--blue)] leading-tight">Orders</h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">Revenue and order volume</p>
        </div>

        {/* ── Month / date filter ─────────────────────────────────────────── */}
        <div className={`${CARD} flex flex-wrap items-center gap-3 mb-5`}>
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">From</span>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={INPUT_CLS} />
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">To</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={INPUT_CLS} />
          <button onClick={loadData}
            className="bg-[var(--blue)] text-white rounded-md px-5 py-1.5 text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity border-0">
            Apply
          </button>
        </div>

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}
        {loading && (
          <div className="flex items-center justify-center h-48 text-[var(--text-muted)] text-[14px]">
            Loading orders data…
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── 2 stat cards side by side ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {statCards.map(({ iconSrc, label, value, sub }) => (
                <div key={label} className={CARD}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <img src={iconSrc} alt="" width="28" height="28" className="icon-adaptive" />
                    <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{label}</span>
                  </div>
                  <div className="text-[28px] font-bold text-[var(--text-primary)] leading-tight">{value}</div>
                  <div className="text-[12px] text-[var(--text-muted)] mt-2">{sub}</div>
                </div>
              ))}
            </div>

            {/* ── 2 charts side by side ───────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Revenue by City — Bar or Line Chart */}
              <div className={CARD}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <img src={revenueIcon} alt="" width="18" height="18" className="icon-adaptive" />
                    <div className="text-[14px] font-bold text-[var(--blue)]">Revenue by City</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Bar/Line Toggle */}
                    <div className="flex items-center bg-[var(--bg-primary)] border border-[var(--border)] rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => setCityChartType('bar')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border-0 cursor-pointer transition-colors ${cityChartType === 'bar' ? 'bg-[var(--blue)] text-white' : 'bg-transparent text-[var(--text-muted)]'}`}
                      >
                        Bar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCityChartType('line')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border-0 cursor-pointer transition-colors ${cityChartType === 'line' ? 'bg-[var(--blue)] text-white' : 'bg-transparent text-[var(--text-muted)]'}`}
                      >
                        Line
                      </button>
                    </div>

                    {/* Figma-style pill dropdown */}
                    <div className="relative">
                      <select
                        value={selectedState}
                        onChange={e => setSelectedState(e.target.value)}
                        aria-label="Filter by state"
                        style={{
                          appearance: 'none', WebkitAppearance: 'none',
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border)',
                          borderRadius: 999,
                          padding: '4px 28px 4px 12px',
                          fontSize: 12, fontWeight: 500,
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {stateOptions.map(s => (
                          <option key={s} value={s === 'All States' ? '' : s}>
                            {s === 'All States' ? 'All States' : s}
                          </option>
                        ))}
                      </select>
                      {/* Chevron */}
                      <svg style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
                        width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 3.5 L5 6.5 L8 3.5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                {revenueByCityData.length === 0
                  ? <div className="flex items-center justify-center h-48 text-[var(--text-muted)] text-[13px]">No data.</div>
                  : <ResponsiveContainer width="100%" height={240}>
                      {cityChartType === 'bar' ? (
                        <BarChart data={revenueByCityData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                          <XAxis dataKey="label" tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} interval={0} />
                          <YAxis tickFormatter={formatCompact} tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} width={52} />
                          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={{ fill: colors.cursor }} />
                          <Bar dataKey="revenue" fill={colors.bar} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : (
                        <LineChart data={revenueByCityData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                          <XAxis dataKey="label" tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} interval={0} />
                          <YAxis tickFormatter={formatCompact} tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} width={52} />
                          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={{ stroke: colors.bar, strokeOpacity: 0.3 }} />
                          <Line type="monotone" dataKey="revenue" stroke={colors.bar} strokeWidth={2} dot={false} />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                }
              </div>

              {/* Monthly Revenue — with Bar/Line toggle + month pill dropdown */}
              <div className={CARD}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <img src={revenueIcon} alt="" width="18" height="18" className="icon-adaptive" />
                    <div className="text-[14px] font-bold text-[var(--blue)]">Monthly Revenue</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Bar/Line Toggle */}
                    <div className="flex items-center bg-[var(--bg-primary)] border border-[var(--border)] rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => setMonthlyChartType('line')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border-0 cursor-pointer transition-colors ${monthlyChartType === 'line' ? 'bg-[var(--blue)] text-white' : 'bg-transparent text-[var(--text-muted)]'}`}
                      >
                        Line
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyChartType('bar')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border-0 cursor-pointer transition-colors ${monthlyChartType === 'bar' ? 'bg-[var(--blue)] text-white' : 'bg-transparent text-[var(--text-muted)]'}`}
                      >
                        Bar
                      </button>
                    </div>
                  </div>
                </div>
                {monthlyData.length === 0
                  ? <div className="flex items-center justify-center h-48 text-[var(--text-muted)] text-[13px]">No orders found.</div>
                  : <ResponsiveContainer width="100%" height={240}>
                      {monthlyChartType === 'bar' ? (
                        <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                          <XAxis dataKey="label" tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} interval={0} />
                          <YAxis tickFormatter={formatCompact} tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} width={52} />
                          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={{ fill: colors.cursor }} />
                          <Bar dataKey="revenue" fill={colors.bar} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : (
                        <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                          <XAxis dataKey="label" tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} interval={0} />
                          <YAxis tickFormatter={formatCompact} tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} width={52} />
                          <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={{ stroke: colors.bar, strokeOpacity: 0.3 }} />
                          <Line type="monotone" dataKey="revenue" stroke={colors.bar} strokeWidth={2} dot={false} />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                }
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
