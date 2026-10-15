import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../utils/AuthContext';
import ServiceStatus from './ServiceStatus';
import indigoLogo from '../assets/icons/indigo_biomed_logo_transparent 1.svg';

const LINKS = [
  { label: 'Orders',    path: '/orders'    },
  { label: 'Products',  path: '/products'  },
  { label: 'Customers', path: '/customers' },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = user || 'John Doe';
  const company = 'Company Name';

  return (
    <>
      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 w-52 sticky top-0 h-screen
                        bg-brand text-white rounded-r-3xl px-5 py-8 z-10">

        {/* Brand — logo + name */}
        <Link
          to="/"
          className="flex flex-col items-center mb-8 text-white no-underline"
          aria-label="Home"
        >
          <img src={indigoLogo} alt="Indigo Bio Med" className="w-16 h-auto" />
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col gap-2.5" aria-label="Main">
          {LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block text-center py-2.5 px-4 rounded-full text-[13px] font-semibold tracking-widest uppercase
                 text-white no-underline transition-colors
                 ${isActive
                   ? 'bg-white !text-brand'
                   : 'hover:bg-white/20'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: service status + theme + user */}
        <div className="mt-auto flex flex-col gap-3">
          <ServiceStatus />
          <button
            type="button"
            onClick={toggle}
            className="bg-white/15 border border-white/25 text-white rounded-md px-3 py-1.5
                       text-[12px] cursor-pointer hover:bg-white/25 transition-colors"
          >
            {dark ? '☀ Light' : '🌙 Dark'}
          </button>

          {/* User row — matches Figma bottom of sidebar */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-white/20">
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center
                            text-[13px] font-bold flex-shrink-0 overflow-hidden">
              {/* Silhouette avatar matching Figma */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4" fill="white" />
                <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate leading-tight">{displayName}</div>
              <div className="text-[11px] opacity-65 truncate">{company}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile / tablet top bar (below lg) ───────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-30 bg-brand text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center text-white no-underline" aria-label="Home">
            <img src={indigoLogo} alt="Indigo Bio Med" className="w-10 h-auto" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="text-[11px] bg-white/15 border border-white/25 rounded px-2 py-1 hidden sm:block"
            >
              {dark ? '☀' : '🌙'}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
              className="p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {menuOpen && (
          <div className="border-t border-white/20 px-4 pb-4 pt-2 flex flex-col gap-2">
            <nav className="flex flex-col gap-1" aria-label="Main">
              {LINKS.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-2.5 px-4 rounded-full text-sm font-semibold tracking-widest uppercase text-white
                     no-underline transition-colors text-center
                     ${isActive ? 'bg-white !text-brand' : 'hover:bg-white/20'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" fill="white" />
                    <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold">{displayName}</div>
                  <ServiceStatus />
                </div>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="text-[11px] bg-white/15 border border-white/25 rounded px-2 py-1 sm:hidden"
              >
                {dark ? '☀' : '🌙'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
