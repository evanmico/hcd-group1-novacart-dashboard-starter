import React from 'react';
import Navbar from './Navbar';

// Common page frame: navigation (top header on phones, sidebar on lg+) + titled content area.
export default function PageShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-page lg:flex-row">
      <Navbar />
      <main className="mx-auto w-full min-w-0 max-w-[1280px] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <div className="mb-5">
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
