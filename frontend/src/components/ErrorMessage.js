import React from 'react';

// Shown whenever a data request fails. Technical details go to the console only.
export const LOAD_ERROR_MESSAGE = "We couldn't load this data. Please try again.";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn-retry" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}
