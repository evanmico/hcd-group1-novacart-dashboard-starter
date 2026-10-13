import React, { createContext, useContext, useEffect, useState } from 'react';
import { authorize } from './dataSource';

const AuthContext = createContext({ user: null, franchiseId: null, status: 'checking' });

const STORAGE_KEY = 'nc-franchise-id';

/**
 * Calls /authorize once when the app starts (FE-03).
 * The backend returns the authenticated user; we keep it as the franchise id
 * in context and in sessionStorage so it survives a page refresh.
 */
export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    franchiseId: sessionStorage.getItem(STORAGE_KEY),
    status: 'checking',
  });

  useEffect(() => {
    let cancelled = false;
    authorize()
      .then(data => {
        if (cancelled) return;
        sessionStorage.setItem(STORAGE_KEY, data.user);
        setState({ user: data.user, franchiseId: data.user, status: 'authorized' });
      })
      .catch(err => {
        console.error('Authorization failed', err);
        if (!cancelled) setState({ user: null, franchiseId: null, status: 'error' });
      });
    return () => { cancelled = true; };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
