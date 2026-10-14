import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../utils/AuthContext';
import ServiceStatus from './ServiceStatus';

const LINKS = [
  { label: 'Orders',    path: '/orders'    },
  { label: 'Products',  path: '/products'  },
  { label: 'Customers', path: '/customers' },
];

// Simple double-helix mark (placeholder for the client's logo image)
function Logo() {
  return (
    <svg className="h-9 w-auto lg:h-11" viewBox="0 0 36 44" fill="none" aria-hidden="true">
      <path d="M8 2 C8 14 28 14 28 22 C28 30 8 30 8 42" stroke="#00D4B4" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 2 C28 14 8 14 8 22 C8 30 28 30 28 42" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 8 H24 M12 36 H24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

// Mobile (< lg): blue top header — brand + user chip, three tab buttons, status + theme toggle.
// Desktop (lg+): fixed blue sidebar with the same content stacked vertically.
export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  const displayName = user || 'Signing in…';
  const initials = user ? user.slice(0, 2).toUpperCase() : '··';

  const avatar = (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-bold text-sidebar"
      aria-hidden="true"
    >
      {initials}
    </div>
  );

  return (
    <aside
      className="flex w-full shrink-0 flex-col rounded-b-[20px] bg-sidebar px-4 pb-4 pt-4 text-white
                 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:rounded-b-none lg:rounded-r-[28px] lg:pb-5 lg:pt-7"
    >
      <div className="flex items-center justify-between gap-3 lg:block">
        <Link
          to="/"
          aria-label="Home"
          className={`flex items-center gap-2 text-white no-underline lg:mb-8 lg:flex-col lg:gap-0.5 ${FOCUS}`}
        >
          <Logo />
          <span className="flex flex-col leading-tight lg:items-center">
            <span className="text-[22px] font-bold leading-tight">Indigo</span>
            <span className="text-[13px] opacity-90">Bio Med</span>
          </span>
        </Link>

        {/* User chip (mobile only; desktop shows the user in the sidebar footer) */}
        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          {avatar}
          <span className="truncate text-sm font-semibold">{displayName}</span>
        </div>
      </div>

      <nav className="mt-4 grid grid-cols-3 gap-2 lg:mt-0 lg:flex lg:flex-col" aria-label="Main">
        {LINKS.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `block rounded-full px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wider no-underline
               sm:text-[13px] lg:px-4 lg:py-3 lg:tracking-[1.5px] ${FOCUS} ${
                isActive ? 'bg-white text-sidebar' : 'text-white hover:bg-white/15'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-3 flex items-center justify-between gap-3 lg:mt-auto lg:flex-col lg:items-stretch lg:gap-3.5">
        <ServiceStatus />
        <button
          type="button"
          onClick={toggle}
          className={`cursor-pointer rounded-md border border-white/30 bg-white/15 px-2.5 py-1.5 text-[13px] text-white hover:bg-white/20 ${FOCUS}`}
        >
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="hidden items-center gap-2.5 lg:flex">
          {avatar}
          <div>
            <div className="text-sm font-semibold">{displayName}</div>
            <div className="text-[13px] opacity-85">NovaCart Franchise</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
