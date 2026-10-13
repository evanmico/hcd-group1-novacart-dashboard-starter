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
  const displayName = user || 'Signing in…';
  const initials = user ? user.slice(0, 2).toUpperCase() : '··';

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-brand" aria-label="Home">
        <Logo />
        <span className="brand-name">Indigo</span>
        <span className="brand-sub">Bio Med</span>
      </Link>

      <nav className="sidebar-nav" aria-label="Main">
        {LINKS.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <ServiceStatus />
        <button type="button" className="theme-toggle" onClick={toggle}>
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="sidebar-user">
          <div className="avatar" aria-hidden="true">{initials}</div>
          <div>
            <div className="user-name">{displayName}</div>
            <div className="user-company">NovaCart Franchise</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
