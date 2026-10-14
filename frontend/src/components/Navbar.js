import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../utils/AuthContext';
import ServiceStatus from './ServiceStatus';

const LINKS = [
  { label: 'Orders',    path: '/orders'    },
  { label: 'Products',  path: '/products'  },
  { label: 'Customers', path: '/customers' },
];

function Logo() {
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none" aria-hidden="true">
      <path d="M8 2 C8 14 28 14 28 22 C28 30 8 30 8 42" stroke="#00D4B4" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 2 C28 14 8 14 8 22 C8 30 28 30 28 42" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 8 H24 M12 36 H24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = user || 'Signing in…';
  const initials = user ? user.slice(0, 2).toUpperCase() : '··';

  return (
    <>
      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 w-60 sticky top-0 h-screen
                        bg-brand text-white rounded-r-3xl px-4 py-7">
        <Link to="/" className="flex flex-col items-center gap-0.5 mb-8 text-white no-underline
                                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Home">
          <Logo />
          <span className="text-xl font-bold leading-tight mt-1">Indigo</span>
          <span className="text-[13px] opacity-90">Bio Med</span>
        </Link>

        <nav className="flex flex-col gap-2" aria-label="Main">
          {LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block text-center py-3 px-4 rounded-full text-[13px] font-semibold tracking-widest uppercase
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

        <div className="mt-auto flex flex-col gap-3.5">
          <ServiceStatus />
          <button
            type="button"
            onClick={toggle}
            className="bg-white/20 border border-white/30 text-white rounded-md px-3 py-1.5
                       text-[13px] cursor-pointer hover:bg-white/30 transition-colors"
          >
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white text-brand flex items-center justify-center
                            text-[13px] font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{displayName}</div>
              <div className="text-[13px] opacity-85">NovaCart Franchise</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile / tablet top bar (below lg) ───────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-30 bg-brand text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-white no-underline" aria-label="Home">
            <Logo />
            <div>
              <div className="text-base font-bold leading-tight">Indigo</div>
              <div className="text-[11px] opacity-90">Bio Med</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="text-[12px] bg-white/20 border border-white/30 rounded px-2 py-1 hidden sm:block"
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
              {/* Hamburger / X icon */}
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

        {/* Dropdown nav */}
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
                <div className="w-8 h-8 rounded-full bg-white text-brand flex items-center justify-center
                                text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{displayName}</div>
                  <ServiceStatus />
                </div>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="text-[12px] bg-white/20 border border-white/30 rounded px-2 py-1 sm:hidden"
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
