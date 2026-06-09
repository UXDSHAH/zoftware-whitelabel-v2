'use client';

import { useEffect } from 'react';

/**
 * ThemeProvider — reads persisted theme from localStorage and applies
 * `data-theme` on the <html> element before first paint (via useEffect).
 *
 * Supported values:
 *   '1' → Theme 1 (default Apple-esque, attribute removed / not set)
 *   '2' → Theme 2 (Enterprise Slate — deep navy, cobalt blue, Plus Jakarta Sans)
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = typeof window !== 'undefined'
      ? localStorage.getItem('zw_theme') ?? '1'
      : '1';

    const html = document.documentElement;
    if (saved === '2') {
      html.setAttribute('data-theme', '2');
    } else {
      html.removeAttribute('data-theme');
    }
  }, []);

  return <>{children}</>;
}
