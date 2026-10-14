/**
 * CustomersView.js — Customer List page
 *
 * This page shows:
 *   - A sortable table of top 20 customers by revenue
 *   - Columns: Name | City | State | Orders | Total Spent
 *   - A date range filter
 *
 * Data comes from utils/dataSource (dummy data by default, see REACT_APP_USE_MOCK).
 */

import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell';
import DateRangeFilter from '../components/DateRangeFilter';
import ErrorMessage, { LOAD_ERROR_MESSAGE } from '../components/ErrorMessage';
import { getCustomers } from '../utils/dataSource';

function formatCurrency(value) {
  if (!value) return '$0';
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Table columns: key matches the customer object field; numeric columns are right-aligned
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
      const data = await getCustomers(startDate, endDate);
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers data', err);
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  // Sort handler — toggles direction if same column, resets to desc if new column
  function handleSort(column) {
    if (sortBy === column) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  }

  // Apply sort to customers array
  const sorted = [...customers].sort((a, b) => {
    const va = a[sortBy], vb = b[sortBy];
    if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
    return sortDir === 'asc'
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

  // Sort indicator helper
  const sortIcon = (col) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  // Screen-reader sort state for a column header
  const ariaSort = (col) => sortBy === col ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <PageShell title="Customers" subtitle="Top 20 customers by revenue">
        <DateRangeFilter
          idPrefix="customers"
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onApply={loadData}
        >
          <span className="col-span-2 text-[13px] text-muted sm:col-span-1 sm:ml-auto">
            {customers.length} customers
          </span>
        </DateRangeFilter>

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}

        {loading && <div className="loading">Loading customers…</div>}

        {!loading && !error && (
          <div className="card">
            <div className="section-title mb-4">
              Top Customers by Revenue
            </div>

            {sorted.length === 0 ? (
              <div className="loading">No customers found for the selected date range.</div>
            ) : (
              <>
              {/* Phones: sort controls (every column) + one card per customer */}
              <div className="mb-3 flex items-center gap-2 md:hidden">
                <label htmlFor="customers-sort" className="text-sm font-semibold text-ink2">Sort by</label>
                <select
                  id="customers-sort"
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setSortDir('desc'); }}
                  className="min-w-0 flex-1 rounded-md border border-line bg-page px-2.5 py-2 text-base text-ink"
                >
                  {COLUMNS.map(col => <option key={col.key} value={col.key}>{col.label}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                  aria-label={`Sort direction: ${sortDir === 'asc' ? 'ascending' : 'descending'}. Tap to reverse.`}
                  className="shrink-0 cursor-pointer rounded-md border border-line bg-page px-3 py-2 text-base font-semibold text-brand"
                >
                  {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
                </button>
              </div>

              <ul className="m-0 flex list-none flex-col gap-3 p-0 md:hidden">
                {sorted.map(c => (
                  <li key={c.customer_id} className="list-card !shadow-none">
                    <div className="font-semibold text-ink">{c.name}</div>
                    <div className="text-sm text-muted">{c.city}, {c.state}</div>
                    <dl className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <dt className="list-label">Orders</dt>
                        <dd className="m-0 font-semibold text-ink">{Number(c.total_orders).toLocaleString('en-US')}</dd>
                      </div>
                      <div>
                        <dt className="list-label">Total Spent</dt>
                        <dd className="m-0 font-bold text-brand">{formatCurrency(c.total_spent)}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>

              {/* md and up: sortable table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="data-table">
                  <thead>
                    <tr>
                      {COLUMNS.map(col => (
                        <th
                          key={col.key}
                          scope="col"
                          className={col.numeric ? 'num' : undefined}
                          aria-sort={ariaSort(col.key)}
                        >
                          <button
                            type="button"
                            className={`sort-btn${sortBy === col.key ? ' active' : ''}`}
                            onClick={() => handleSort(col.key)}
                          >
                            {col.label}{sortIcon(col.key)}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(c => (
                      <tr key={c.customer_id}>
                        <td>{c.name}</td>
                        <td>{c.city}</td>
                        <td>{c.state}</td>
                        <td className="num">{Number(c.total_orders).toLocaleString('en-US')}</td>
                        <td className="num revenue">{formatCurrency(c.total_spent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}

          </div>
        )}
    </PageShell>
  );
}
