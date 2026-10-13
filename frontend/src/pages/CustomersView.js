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
import Navbar from '../components/Navbar';
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
    <div className="app-shell">
      <Navbar />
      <main className="page">

        <div className="page-header">
          <h1>Customers</h1>
          <p>Top 20 customers by revenue</p>
        </div>

        <div className="filter-bar">
          <label htmlFor="customers-from">From</label>
          <input id="customers-from" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <label htmlFor="customers-to">To</label>
          <input id="customers-to" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button className="btn-apply" onClick={loadData}>Apply</button>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
            {customers.length} customers
          </span>
        </div>

        {error && <ErrorMessage message={error} onRetry={error === LOAD_ERROR_MESSAGE ? loadData : undefined} />}

        {loading && <div className="loading">Loading customers…</div>}

        {!loading && !error && (
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>
              Top Customers by Revenue
            </div>

            {sorted.length === 0 ? (
              <div className="loading">No customers found for the selected date range.</div>
            ) : (
              <div className="table-wrap">
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
            )}

          </div>
        )}
      </main>
    </div>
  );
}
