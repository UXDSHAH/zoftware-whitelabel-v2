'use client';

import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * ThemeToggle — switches between Theme 1 (Classic light) and Theme 2 (Dark Indigo).
 *
 * Props:
 *   showLabel  — shows text label + dropdown. Used on the landing page.
 *                Default: false (icon-only, for nav bars)
 */
export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const [theme, setTheme] = useState<'1' | '2'>('1');
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem('zw_theme') ?? '1') as '1' | '2';
    setTheme(saved);
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const apply = (next: '1' | '2') => {
    setTheme(next);
    setOpen(false);
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

  /* ── Landing page variant — pill button + dropdown ── */
  if (showLabel) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-sm text-[12px] font-semibold transition-all select-none"
          style={{
            background: isT2
              ? 'rgba(124,58,237,0.14)'
              : 'rgba(0,0,0,0.05)',
            color: isT2 ? '#A78BFA' : '#555',
            border: isT2 ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {isT2 ? <Moon size={13} strokeWidth={2} /> : <Sun size={13} strokeWidth={2} />}
          <span>{isT2 ? 'Dark Indigo' : 'Classic Light'}</span>
          <span style={{ opacity: 0.5, fontSize: 9, marginLeft: 2 }}>▼</span>
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-1.5 w-44 rounded-sm overflow-hidden z-50"
            style={{
              background: isT2 ? '#161B2E' : '#ffffff',
              border: isT2 ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}
          >
            {/* Theme 1 option */}
            <button
              onClick={() => apply('1')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{
                background: !isT2 ? 'rgba(0,122,255,0.06)' : 'transparent',
                color: isT2 ? '#8B949E' : '#000',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = !isT2 ? 'rgba(0,122,255,0.06)' : 'transparent')}
            >
              <div className="w-6 h-6 rounded-sm bg-white border border-black/10 flex items-center justify-center">
                <Sun size={12} strokeWidth={2} style={{ color: '#007AFF' }} />
              </div>
              <div>
                <div className="text-[12px] font-semibold">Classic Light</div>
                <div className="text-[10px] opacity-50">iOS blue · SF Pro</div>
              </div>
              {!isT2 && <span className="ml-auto text-[10px]" style={{ color: '#007AFF' }}>✓</span>}
            </button>

            {/* Theme 2 option */}
            <button
              onClick={() => apply('2')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{
                background: isT2 ? 'rgba(124,58,237,0.1)' : 'transparent',
                color: isT2 ? '#E6EDF3' : '#000',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = isT2 ? 'rgba(124,58,237,0.15)' : 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = isT2 ? 'rgba(124,58,237,0.1)' : 'transparent')}
            >
              <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
                <Moon size={12} strokeWidth={2} style={{ color: '#fff' }} />
              </div>
              <div>
                <div className="text-[12px] font-semibold">Dark Indigo</div>
                <div className="text-[10px] opacity-50">Violet · Plus Jakarta</div>
              </div>
              {isT2 && <span className="ml-auto text-[10px]" style={{ color: '#A78BFA' }}>✓</span>}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Compact icon-only variant (nav bars) ── */
  return (
    <button
      onClick={() => apply(isT2 ? '1' : '2')}
      title={isT2 ? 'Switch to Classic Light' : 'Switch to Dark Indigo'}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-sm transition-all"
      style={{
        background: isT2 ? 'rgba(124,58,237,0.14)' : 'transparent',
        color: isT2 ? '#A78BFA' : 'var(--th-nav-text-muted, #86868b)',
        border: isT2 ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
      }}
    >
      {isT2 ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
    </button>
  );
}
