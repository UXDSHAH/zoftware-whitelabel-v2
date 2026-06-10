'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Package, Search, Zap, ChevronDown, ExternalLink, User, ShoppingCart } from 'lucide-react';
import UserProfilePanel from './UserProfilePanel';
import ThemeToggle from './ThemeToggle';
import CartPanel from './CartPanel';
import { getOpenCount } from '@/lib/zain-tickets';
import { getCartCount } from '@/lib/cart';

const breadcrumbMap: Record<string, string> = {
  '/software': 'Browse Software',
  '/bundles': 'Bundles',
  '/checkout': 'Checkout',
};

// Map each route pattern to its parent path for the back button
function getBackTarget(pathname: string): string | null {
  if (pathname.startsWith('/software/report/'))  return '/software';
  if (pathname.startsWith('/software/product/')) return '/software';
  if (pathname.startsWith('/software/category/')) return '/software';
  if (pathname.startsWith('/bundles/'))          return '/software?view=bundles';
  if (pathname === '/checkout')                  return '/software';
  if (pathname === '/software')                  return '/software-gateway';
  return null;
}

export default function GatewayHeader() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openTickets, setOpenTickets] = useState(0);
  const [cartCount,   setCartCount]   = useState(0);
  const [cartOpen,    setCartOpen]    = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenTickets(getOpenCount() + 1);
    setCartCount(getCartCount());
    const onTickets  = () => setOpenTickets(getOpenCount() + 1);
    const onCart     = () => setCartCount(getCartCount());
    const onOpenCart = () => setCartOpen(true);
    window.addEventListener('zg-tickets-updated', onTickets);
    window.addEventListener('zg-cart-updated', onCart);
    document.addEventListener('zg-open-cart', onOpenCart);
    return () => {
      window.removeEventListener('zg-tickets-updated', onTickets);
      window.removeEventListener('zg-cart-updated', onCart);
      document.removeEventListener('zg-open-cart', onOpenCart);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const crumb =
    breadcrumbMap[pathname] ||
    (pathname.startsWith('/software/category') ? 'Category' :
     pathname.startsWith('/software/product') ? 'Product Detail' :
     pathname.startsWith('/bundles/') ? 'Bundle Detail' :
     'Software Gateway');

  return (
    <>
      <header className="gw-header sticky top-0 z-40 backdrop-blur-xl border-b">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          <Link href="/software-gateway" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[2px]">
                {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]" />)}
              </div>
            </div>
            <span className="gw-nav-text text-[14px] font-bold tracking-tight">LOGO</span>
          </Link>

          <div className="gw-nav-divider w-px h-4 shrink-0" />

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-5 h-5 rounded-sm bg-accent flex items-center justify-center">
              <Zap size={11} strokeWidth={2} className="text-white" />
            </div>
            <span className="gw-nav-text text-[12px] font-semibold hidden sm:block">Software Gateway</span>
          </div>

          {getBackTarget(pathname) ? (
            <>
              <div className="gw-nav-divider w-px h-4 shrink-0" />
              <Link
                href={getBackTarget(pathname)!}
                className="flex items-center gap-1 text-[12px] font-medium shrink-0 transition-colors"
                style={{ color: 'var(--gw-nav-muted, #888)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gw-nav-text, #111)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gw-nav-muted, #888)')}>
                <ArrowLeft size={12} /> Back
              </Link>
            </>
          ) : (
            <>
              <div className="gw-nav-divider w-px h-4 shrink-0 hidden sm:block" />
              <span className="gw-nav-muted text-[12px] hidden sm:block truncate">{crumb}</span>
            </>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <Link href="/software"
              className="gw-nav-link hidden sm:flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-sm">
              <Search size={12} /> Browse
            </Link>
            <Link href="/software?view=bundles"
              className="gw-nav-link hidden sm:flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-sm">
              <Package size={12} /> Bundles
            </Link>

            {/* Cart icon */}
            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-black/5 transition-colors">
              <ShoppingCart size={16} style={{ color: 'var(--gw-nav-text, #111)' }} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent border-2 border-white flex items-center justify-center text-[8px] font-bold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            <ThemeToggle />

            {/* ── Profile dropdown ── */}
            <div ref={dropdownRef} className="relative ml-1">
              <button
                onClick={() => setDropdownOpen(d => !d)}
                className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-black/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                  RS
                  {openTickets > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ea580c] border-2 border-white flex items-center justify-center">
                      <span className="text-[7px] font-bold text-white leading-none">{openTickets}</span>
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-medium hidden sm:block" style={{ color: 'var(--gw-nav-text, #111)' }}>Ravi</span>
                <ChevronDown size={11} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--gw-nav-muted, #888)' }} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-black/8 rounded-xl shadow-xl py-1 z-50 min-w-[180px]">
                  <div className="px-4 py-2 border-b border-black/6 mb-1">
                    <p className="text-[12px] font-semibold text-black">Ravi Sharma</p>
                    <p className="text-[10px] text-muted">Gulf Enterprises LLC</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); setProfileOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f4f4f6] transition-colors">
                    <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                    <User size={13} className="text-muted" />
                    Business
                  </button>
                  <a
                    href="https://platform-five-plum-39.vercel.app/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f4f4f6] transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <ExternalLink size={13} className="text-muted" />
                    Partner
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {profileOpen && <UserProfilePanel onClose={() => setProfileOpen(false)} />}
      {cartOpen    && <CartPanel        onClose={() => setCartOpen(false)} />}
    </>
  );
}
