import React from 'react';

export const LOAD_ERROR_MESSAGE = "We couldn't load this data. Please try again.";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 flex-wrap
                 px-4 py-3 mb-4 rounded-lg text-sm
                 text-red-700 bg-red-50 border border-red-200
                 dark:text-red-300 dark:bg-red-950/40 dark:border-red-800"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="border border-current rounded px-3 py-1 text-xs font-semibold
                     hover:opacity-75 transition-opacity cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
}
