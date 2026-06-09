'use client';

import { useEffect, useRef, useState } from 'react';
import { Palette } from 'lucide-react';

/**
 * ThemeToggle
 *   showLabel (default false) → icon-only, used in GatewayHeader & Navbar
 *   showLabel = true          → dropdown selector, used on the landing page
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
    document.documentElement[next === '2' ? 'setAttribute' : 'removeAttribute']('data-theme', '2');
  };

  if (!mounted) return null;
  const isT2 = theme === '2';

  /* ── Landing page: pill button + dropdown picker ── */
  if (showLabel) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold transition-all rounded-full border select-none"
          style={{
            background: isT2 ? 'rgba(219,61,94,0.08)' : 'rgba(0,0,0,0.04)',
            color: isT2 ? '#DB3D5E' : '#555',
            borderColor: isT2 ? 'rgba(219,61,94,0.25)' : 'rgba(0,0,0,0.1)',
          }}
        >
          <Palette size={13} strokeWidth={2} />
          <span>{isT2 ? 'Warm Studio' : 'Classic'}</span>
          <span style={{ opacity: 0.45, fontSize: 8 }}>▼</span>
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-52 z-[200] overflow-hidden"
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ padding: '6px 6px' }}>
              {/* Theme 1 */}
              <button
                onClick={() => apply('1')}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                style={{
                  borderRadius: 10,
                  background: !isT2 ? 'rgba(0,122,255,0.06)' : 'transparent',
                }}
                onMouseEnter={e => !isT2 || (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = !isT2 ? 'rgba(0,122,255,0.06)' : 'transparent')}
              >
                {/* Swatch */}
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: '#007AFF' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#000', lineHeight: 1.3 }}>Classic</div>
                  <div style={{ fontSize: 10, color: '#86868b', marginTop: 1 }}>White · iOS Blue · SF Pro</div>
                </div>
                {!isT2 && <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', background: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>}
              </button>

              {/* Theme 2 */}
              <button
                onClick={() => apply('2')}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                style={{
                  borderRadius: 10,
                  background: isT2 ? 'rgba(219,61,94,0.06)' : 'transparent',
                }}
                onMouseEnter={e => isT2 || (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = isT2 ? 'rgba(219,61,94,0.06)' : 'transparent')}
              >
                {/* Swatch */}
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F6F1EB', border: '1px solid #E2D9D0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 7, background: '#DB3D5E' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1A130C', lineHeight: 1.3 }}>Warm Studio</div>
                  <div style={{ fontSize: 10, color: '#9E8E84', marginTop: 1 }}>Cream · Rose · Jakarta</div>
                </div>
                {isT2 && <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', background: '#DB3D5E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Nav bars: icon-only toggle ── */
  return (
    <button
      onClick={() => apply(isT2 ? '1' : '2')}
      title={isT2 ? 'Switch to Classic' : 'Switch to Warm Studio'}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
      style={{
        background: isT2 ? 'rgba(219,61,94,0.1)' : 'transparent',
        color: isT2 ? '#DB3D5E' : 'var(--th-nav-text-muted, #86868b)',
        border: isT2 ? '1px solid rgba(219,61,94,0.25)' : '1px solid transparent',
      }}
    >
      <Palette size={14} strokeWidth={2} />
    </button>
  );
}
