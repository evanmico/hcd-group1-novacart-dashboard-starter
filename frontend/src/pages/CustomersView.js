/**
 * CustomersView.js — Customer List page
 * Shows top 20 customers by revenue in a sortable, responsive table.
 * Fully responsive with Tailwind CSS.
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import { getCustomers } from '../utils/dataSource';

function formatCurrency(value) {
  if (!value) return '$0';
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const COLUMNS = [
  { key: 'name',         label: 'Name',        numeric: false },
  { key: 'city',         label: 'City',        numeric: false },
  { key: 'state',        label: 'State',       numeric: false },
  { key: 'total_orders', label: 'Orders',      numeric: true  },
  { key: 'total_spent',  label: 'Total Spent', numeric: true  },
];

export default function CustomersView() {
  const [startDate,  setStartDate]  = useState('2022-01-01');
  const [endDate,    setEndDate]    = useState('2022-12-31');
  const [customers,  setCustomers]  = useState([]);
  const [sortBy,     setSortBy]     = useState('total_spent');
  const [sortDir,    setSortDir]    = useState('desc');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

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
      const data = await getCustomers(startDate, endDate);
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers data', err);
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(column) {
    if (sortBy === column) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  }

  const sorted = [...customers].sort((a, b) => {
    const va = a[sortBy], vb = b[sortBy];
    if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
    return sortDir === 'asc'
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

  const sortIcon  = (col) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';
  const ariaSort  = (col) => sortBy === col ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';

  const card = `bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)]
                p-4 sm:p-5 shadow-[var(--shadow)] mb-5`;

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="text-[clamp(26px,2vw+18px,38px)] font-bold leading-tight text-brand">Customers</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Top 20 customers by revenue</p>
        </div>

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <div className={`${card} flex flex-wrap items-center gap-3`}>
          <label htmlFor="customers-from" className="text-sm font-semibold text-[var(--text-secondary)]">From</label>
          <input
            id="customers-from" type="date" value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-md
                       px-2.5 py-1.5 text-sm text-[var(--text-primary)] min-w-0"
          />
          <label htmlFor="customers-to" className="text-sm font-semibold text-[var(--text-secondary)]">To</label>
          <input
            id="customers-to" type="date" value={endDate}
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
          <span className="ml-auto text-xs text-[var(--text-muted)]">
            {customers.length} customers
          </span>
        </div>

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}

        {loading && (
          <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
            Loading customers…
          </div>
        )}

        {!loading && !error && (
          <div className={card}>
            <div className="text-lg font-bold text-brand mb-4">Top Customers by Revenue</div>

            {sorted.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-[var(--text-muted)]">
                No customers found for the selected date range.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm text-[var(--text-primary)]">
                  <thead>
                    <tr>
                      {COLUMNS.map(col => (
                        <th
                          key={col.key}
                          scope="col"
                          aria-sort={ariaSort(col.key)}
                          className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide
                                      text-[var(--text-muted)] border-b border-[var(--border)] whitespace-nowrap
                                      ${col.numeric ? 'text-right' : 'text-left'}`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSort(col.key)}
                            className={`bg-transparent border-none p-0 cursor-pointer font-[inherit]
                                        text-[inherit] uppercase tracking-[inherit] text-xs
                                        hover:text-brand focus-visible:text-brand transition-colors
                                        ${sortBy === col.key ? 'text-brand' : ''}`}
                          >
                            {col.label}{sortIcon(col.key)}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(c => (
                      <tr key={c.customer_id} className="hover:bg-brand/5 transition-colors">
                        <td className="px-3 py-2.5 border-b border-[var(--border)]">{c.name}</td>
                        <td className="px-3 py-2.5 border-b border-[var(--border)]">{c.city}</td>
                        <td className="px-3 py-2.5 border-b border-[var(--border)]">{c.state}</td>
                        <td className="px-3 py-2.5 border-b border-[var(--border)] text-right">
                          {Number(c.total_orders).toLocaleString('en-US')}
                        </td>
                        <td className="px-3 py-2.5 border-b border-[var(--border)] text-right font-bold text-brand">
                          {formatCurrency(c.total_spent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
