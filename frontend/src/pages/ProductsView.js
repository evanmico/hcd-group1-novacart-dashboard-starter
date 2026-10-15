import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import { getProducts } from '../utils/dataSource';
import { useTheme } from '../utils/ThemeContext';
import { getChartTheme } from '../utils/chartTheme';
import electronicsIcon from '../assets/icons/electronics.svg';
import accessoriesIcon from '../assets/icons/accessories.svg';
import storageIcon from '../assets/icons/storage.svg';

function formatCompact(v) {
  if (!v) return '$0';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
function formatFull(v) {
  return `$${Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
function truncate(text, max = 18) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

const CATEGORY_ICONS = {
  Electronics: electronicsIcon,
  Accessories: accessoriesIcon,
  Storage:     storageIcon,
};
function CategoryIcon({ category }) {
  const src = CATEGORY_ICONS[category];
  if (!src) return <span style={{ display:'inline-block', width:16, height:16, borderRadius:'50%', background:'var(--blue)', flexShrink:0 }} />;
  return <img src={src} alt={category} width="16" height="16" className="icon-adaptive" style={{ flexShrink:0, display:'block' }} />;
}

const CARD = 'bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-5 shadow-[var(--shadow)]';
const INPUT_CLS = 'bg-[var(--bg-primary)] border border-[var(--border)] rounded-md px-3 py-1.5 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--blue)]';

const MONTHS = [
  { label: 'January',   value: '2022-01-01', end: '2022-01-31' },
  { label: 'February',  value: '2022-02-01', end: '2022-02-28' },
  { label: 'March',     value: '2022-03-01', end: '2022-03-31' },
  { label: 'April',     value: '2022-04-01', end: '2022-04-30' },
  { label: 'May',       value: '2022-05-01', end: '2022-05-31' },
  { label: 'June',      value: '2022-06-01', end: '2022-06-30' },
  { label: 'July',      value: '2022-07-01', end: '2022-07-31' },
  { label: 'August',    value: '2022-08-01', end: '2022-08-31' },
  { label: 'September', value: '2022-09-01', end: '2022-09-30' },
  { label: 'October',   value: '2022-10-01', end: '2022-10-31' },
  { label: 'November',  value: '2022-11-01', end: '2022-11-30' },
  { label: 'December',  value: '2022-12-01', end: '2022-12-31' },
  { label: 'Full Year', value: '2022-01-01', end: '2022-12-31' },
];

export default function ProductsView() {
  const { dark } = useTheme();
  const { colors, axisTick, tooltipStyle } = getChartTheme(dark);

  const [selectedMonth, setSelectedMonth] = useState('Full Year');
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const currentMonth = MONTHS.find(m => m.label === selectedMonth) || MONTHS[MONTHS.length - 1];

  useEffect(() => { loadData(); }, [selectedMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadData() {
    setLoading(true); setError(null);
    try {
      setProducts(await getProducts(currentMonth.value, currentMonth.end));
    } catch (err) {
      console.error(err); setError(LOAD_ERROR_MESSAGE);
    } finally { setLoading(false); }
  }

  // Horizontal bar chart data (top 10, reversed so highest is at top)
  const chartData = products.slice(0, 10).map(p => ({ ...p, short_name: truncate(p.name) })).reverse();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 min-w-0 px-6 py-7">

        {/* Page header + month filter */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--blue)] leading-tight">Products</h1>
            <p className="text-[13px] text-[var(--text-muted)] mt-1">Top 10 products by revenue</p>
          </div>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className={`${INPUT_CLS} mt-1 flex-shrink-0`}
            aria-label="Select month"
          >
            {MONTHS.map(m => (
              <option key={m.label} value={m.label}>{m.label}</option>
            ))}
          </select>
        </div>

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}
        {loading && (
          <div className="flex items-center justify-center h-48 text-[var(--text-muted)] text-[14px]">
            Loading products data…
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Horizontal bar chart: Top 10 products by revenue ─────────── */}
            <div className={`${CARD} mb-5`} style={{ borderTopColor: 'var(--accent)', borderTopWidth: 2 }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[14px] font-bold text-[var(--blue)]">Top 10 Products by Revenue</div>
                  <div className="text-[12px] text-[var(--text-muted)] mt-0.5">Revenue in USD</div>
                </div>
                {/* Revenue legend */}
                <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] border border-[var(--border)] rounded px-2 py-1">
                  <span style={{ display:'inline-block', width:10, height:10, borderRadius:2, background: colors.bar }} />
                  Revenue
                </div>
              </div>

              {chartData.length === 0
                ? <div className="flex items-center justify-center h-48 text-[var(--text-muted)] text-[13px]">No products found.</div>
                : <ResponsiveContainer width="100%" height={Math.max(chartData.length * 36 + 20, 200)}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 60, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                      <XAxis type="number" tickFormatter={formatCompact} tick={{ ...axisTick, fontSize: 11 }} stroke={colors.grid} />
                      <YAxis type="category" dataKey="short_name" width={130} tick={{ ...axisTick, fontSize: 12 }} stroke={colors.grid} interval={0} />
                      <Tooltip formatter={(v) => [formatFull(v), 'Revenue']} labelFormatter={(l, p) => p?.[0]?.payload?.name || l} contentStyle={tooltipStyle} cursor={{ fill: colors.cursor }} />
                      <Bar dataKey="revenue" radius={[0, 4, 4, 0]} label={{ position: 'right', formatter: formatCompact, fontSize: 11, fill: 'var(--text-muted)' }}>
                        {chartData.map((p, i) => (
                          <Cell key={p.product_id} fill={i === chartData.length - 1 ? colors.highlight : colors.bar} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              }
            </div>

            {/* ── Product table ────────────────────────────────────────────── */}
            <div className={CARD}>
              <div className="text-[14px] font-bold text-[var(--blue)] mb-4">Product Name · Category</div>
              {products.length === 0
                ? <div className="flex items-center justify-center h-32 text-[var(--text-muted)] text-[13px]">No products found.</div>
                : <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: 'var(--text-primary)' }}>
                      <thead>
                        <tr>
                          {[['Product Name', false], ['Category', false], ['Units Sold', true], ['Revenue', true]].map(([h, num]) => (
                            <th key={h} style={{ padding: '9px 12px', textAlign: num ? 'right' : 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, i) => (
                          <tr key={p.product_id}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,79,255,0.04)'}
                              onMouseLeave={e => e.currentTarget.style.background = ''}>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                              <div className="flex items-center gap-2.5">
                                <CategoryIcon category={p.category} />
                                <div>
                                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{p.category}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{p.category}</td>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{Number(p.units_sold).toLocaleString('en-US')}</td>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 700, color: 'var(--blue)' }}>{formatFull(p.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>
          </>
        )}
      </main>
    </div>
  );
}
