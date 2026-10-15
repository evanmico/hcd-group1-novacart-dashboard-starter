import React, { createContext, useContext, useState } from 'react';

const DateRangeContext = createContext();

export function DateRangeProvider({ children }) {
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate, setEndDate] = useState('2022-12-31');

  return (
    <DateRangeContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export const useDateRange = () => useContext(DateRangeContext);
