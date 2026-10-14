import React from 'react';

// From / To date inputs with an Apply button. Stacks full-width on phones.
export default function DateRangeFilter({ idPrefix, startDate, endDate, onStartChange, onEndChange, onApply, children }) {
  return (
    <div className="filter-bar">
      <div className="filter-field">
        <label htmlFor={`${idPrefix}-from`}>From</label>
        <input id={`${idPrefix}-from`} type="date" value={startDate} onChange={e => onStartChange(e.target.value)} />
      </div>
      <div className="filter-field">
        <label htmlFor={`${idPrefix}-to`}>To</label>
        <input id={`${idPrefix}-to`} type="date" value={endDate} onChange={e => onEndChange(e.target.value)} />
      </div>
      <button type="button" className="btn-apply" onClick={onApply}>Apply</button>
      {children}
    </div>
  );
}
