'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Package, Search, Zap } from 'lucide-react';
import UserProfilePanel from './UserProfilePanel';
import ThemeToggle from './ThemeToggle';

// Open ticket count — drives notification dot
const OPEN_TICKETS = 1;

const breadcrumbMap: Record<string, string> = {
  '/software': 'Browse Software',
  '/bundles': 'Bundles',
  '/checkout': 'Checkout',
};

export default function GatewayHeader() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

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

          {/* Logo */}
          <Link href="/dubai-chamber" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[2px]">
                {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]" />)}
              </div>
            </div>
            <span className="gw-nav-text text-[14px] font-bold tracking-tight">LOGO</span>
          </Link>

          <div className="gw-nav-divider w-px h-4 shrink-0" />

          {/* Gateway label */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-5 h-5 rounded-sm bg-accent flex items-center justify-center">
              <Zap size={11} strokeWidth={2} className="text-white" />
            </div>
            <span className="gw-nav-text text-[12px] font-semibold hidden sm:block">Software Gateway</span>
          </div>

          <div className="gw-nav-divider w-px h-4 shrink-0 hidden sm:block" />

          {/* Breadcrumb */}
          <span className="gw-nav-muted text-[12px] hidden sm:block truncate">{crumb}</span>

          {/* Right nav */}
          <div className="ml-auto flex items-center gap-1.5">
            <Link href="/software"
              className="gw-nav-link hidden sm:flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-sm">
              <Search size={12} /> Browse
            </Link>
            <Link href="/software?view=bundles"
              className="gw-nav-link hidden sm:flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-sm">
              <Package size={12} /> Bundles
            </Link>
            <Link href="/dubai-chamber"
              className="gw-nav-accent hidden sm:flex items-center gap-1.5 text-[12px] font-semibold transition-colors px-3 py-1.5 border rounded-sm min-h-[36px]">
              <ArrowLeft size={12} /> Dubai Chamber
            </Link>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* ── User avatar / profile trigger ── */}
            <button
              onClick={() => setProfileOpen(true)}
              aria-label="Open user profile"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold hover:scale-105 transition-transform shrink-0 ml-1"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}
            >
              RS
              {/* Notification dot — open tickets */}
              {OPEN_TICKETS > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ea580c] border-2 border-white flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white leading-none">{OPEN_TICKETS}</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Profile slide-out panel */}
      {profileOpen && <UserProfilePanel onClose={() => setProfileOpen(false)} />}
    </>
  );
}
