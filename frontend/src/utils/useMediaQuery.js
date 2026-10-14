import { useState, useEffect } from 'react';

// True while the viewport matches the CSS media query, e.g. useMediaQuery('(max-width: 639px)').
// Used for Recharts sizing, which cannot be driven by CSS classes.
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
