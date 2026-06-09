'use client';

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

/**
 * ThemeToggle — floating button that switches between Theme 1 (Apple-esque)
 * and Theme 2 (Enterprise Slate). Persists preference in localStorage.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'1' | '2'>('1');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('zw_theme') ?? '1') as '1' | '2';
    setTheme(saved);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: '1' | '2' = theme === '1' ? '2' : '1';
    setTheme(next);
    localStorage.setItem('zw_theme', next);
    const html = document.documentElement;
    if (next === '2') {
      html.setAttribute('data-theme', '2');
    } else {
      html.removeAttribute('data-theme');
    }
  };

  if (!mounted) return null;

  const isT2 = theme === '2';

  return (
    <button
      onClick={toggle}
      title={isT2 ? 'Switch to Theme 1 (Classic)' : 'Switch to Theme 2 (Enterprise)'}
      aria-label="Toggle theme"
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-sm text-[11px] font-semibold transition-all duration-200 select-none"
      style={{
        background: isT2
          ? 'rgba(37,99,235,0.15)'
          : 'rgba(0,0,0,0.05)',
        color: isT2 ? '#60A5FA' : '#86868b',
        border: isT2 ? '1px solid rgba(37,99,235,0.3)' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Palette size={12} strokeWidth={2} />
      <span className="hidden sm:inline">{isT2 ? 'Enterprise' : 'Classic'}</span>
    </button>
  );
}
