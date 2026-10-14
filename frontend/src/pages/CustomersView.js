import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import { getCustomers } from '../utils/dataSource';

function formatCurrency(v) {
  if (!v) return '$0';
  return `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Map US state abbreviations to full names (for display as "Country" equivalent)
const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',
  DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',
  IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',
  MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',
  NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',
  OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',
  WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',
};

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

const COLUMNS = [
  { key: 'name',         label: 'Name',         numeric: false },
  { key: 'city',         label: 'City',         numeric: false },
  { key: 'total_orders', label: 'Order Count',   numeric: true  },
  { key: 'total_spent',  label: 'Total Spent',   numeric: true  },
];

export default function CustomersView() {
  const [selectedMonth, setSelectedMonth] = useState('Full Year');
  const [customers,  setCustomers]  = useState([]);
  const [sortBy,     setSortBy]     = useState('total_spent');
  const [sortDir,    setSortDir]    = useState('desc');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const currentMonth = MONTHS.find(m => m.label === selectedMonth) || MONTHS[MONTHS.length - 1];

  useEffect(() => { loadData(); }, [selectedMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadData() {
    setLoading(true); setError(null);
    try {
      setCustomers(await getCustomers(currentMonth.value, currentMonth.end));
    } catch (err) {
      console.error(err); setError(LOAD_ERROR_MESSAGE);
    } finally { setLoading(false); }
  }

  function handleSort(col) {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  }

  const sorted = [...customers].sort((a, b) => {
    const va = a[sortBy], vb = b[sortBy];
    if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
    return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  const sortIcon = (col) => {
    if (sortBy !== col) return <span style={{ color: 'var(--border)', marginLeft: 4 }}>↕</span>;
    return <span style={{ color: 'var(--blue)', marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 min-w-0 px-6 py-7">

        {/* Page header + month filter */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--blue)] leading-tight">Customers</h1>
            <p className="text-[13px] text-[var(--text-muted)] mt-1">Top 20 customers by revenue · Sample data</p>
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
            Loading customers…
          </div>
        )}

        {!loading && !error && (
          <div className={CARD}>
            {sorted.length === 0
              ? <div className="flex items-center justify-center h-32 text-[var(--text-muted)] text-[13px]">No customers found.</div>
              : <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: 'var(--text-primary)' }}>
                    <thead>
                      <tr>
                        {COLUMNS.map(col => (
                          <th key={col.key} scope="col"
                              aria-sort={sortBy === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                              style={{ padding: '10px 12px', textAlign: col.numeric ? 'right' : 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap' }}>
                            <button type="button" onClick={() => handleSort(col.key)}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: sortBy === col.key ? 'var(--blue)' : 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', fontSize: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
                              {col.label}{sortIcon(col.key)}
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map(c => (
                        <tr key={c.customer_id}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,79,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}>
                          {/* Name + state */}
                          <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 600 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{STATE_NAMES[c.state] || c.state}</div>
                          </td>
                          {/* City */}
                          <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            {c.city}
                          </td>
                          {/* Order count */}
                          <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                            {Number(c.total_orders).toLocaleString('en-US')}
                          </td>
                          {/* Total spent */}
                          <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 700, color: 'var(--blue)' }}>
                            {formatCurrency(c.total_spent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>
        )}
      </main>
    </div>
  );
}
