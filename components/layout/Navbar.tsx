'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/products?q=${encodeURIComponent(query)}`); setMobileOpen(false); }
  };

  const navLinks = [
    { label: 'Discover', href: '/products' },
    { label: 'Categories', href: '/software' },
    { label: 'Bundles', href: '/software?view=bundles' },
    { label: 'Compare', href: '/compare' },
    { label: 'For Partners', href: '/partner' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)}>
            <img src="/zoftware-logo.svg" alt="Zoftware" className="h-5 w-auto" />
          </Link>

          {/* Vertical divider — desktop */}
          <div className="w-px h-4 bg-black/12 shrink-0 hidden sm:block" />

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[380px] hidden sm:block">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search 50+ software products..."
                className="w-full bg-surface border-0 pl-8 pr-4 py-1.5 text-[13px] text-black placeholder-muted rounded-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-colors"
              />
            </div>
          </form>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-0.5 ml-1">
            {navLinks.map(({ label, href }) => {
              const isPartner = href === '/partner';
              const isActive = pathname === href;
              if (isPartner) {
                return (
                  <Link key={label} href={href}
                    className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-sm transition-colors border ${isActive ? 'bg-accent text-white border-accent' : 'text-accent border-accent/30 hover:bg-accent/8'}`}>
                    {label}
                  </Link>
                );
              }
              return (
                <Link key={label} href={href}
                  className={`px-3.5 py-1.5 text-[13px] font-medium rounded-sm transition-colors ${isActive ? 'bg-accent text-white' : 'text-muted hover:text-black hover:bg-surface'}`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            {/* Currency toggle — desktop */}
            <div className="hidden md:flex items-center gap-1 bg-surface p-0.5 rounded-sm mr-2">
              <button className="px-2.5 py-1 text-[11px] font-semibold bg-white text-black rounded-sm shadow-sm transition-all">USD</button>
              <button className="px-2.5 py-1 text-[11px] font-medium text-muted hover:text-black rounded-sm transition-all">AED</button>
            </div>

            <button className="w-8 h-8 hidden sm:flex items-center justify-center text-muted hover:text-black hover:bg-surface rounded-sm transition-colors">
              <Bell size={16} />
            </button>
            <ThemeToggle />
            <Link href="/sign-in"
              className="hidden sm:flex items-center gap-2 ml-1 text-[13px] border border-black/10 bg-white text-black px-3.5 py-1.5 hover:bg-surface transition-colors rounded-sm font-medium">
              <User size={13} /> Sign In
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="sm:hidden w-9 h-9 flex items-center justify-center text-black hover:bg-surface rounded-sm transition-colors ml-1"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-30 top-14" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative bg-white border-b border-black/8 px-4 py-4 shadow-lg" onClick={e => e.stopPropagation()}>
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-surface border-0 pl-8 pr-4 py-2.5 text-[14px] text-black placeholder-muted rounded-sm outline-none"
                />
              </div>
            </form>

            {/* Nav links */}
            <nav className="space-y-1 mb-4">
              {navLinks.map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-[14px] font-medium rounded-sm transition-colors ${pathname === href ? 'bg-accent text-white' : 'text-black hover:bg-surface'}`}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* Currency toggle */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-black/8">
              <span className="text-[12px] text-muted font-medium">Currency:</span>
              <div className="flex items-center gap-1 bg-surface p-0.5 rounded-sm">
                <button className="px-3 py-1 text-[12px] font-semibold bg-white text-black rounded-sm shadow-sm">USD</button>
                <button className="px-3 py-1 text-[12px] font-medium text-muted hover:text-black rounded-sm">AED</button>
              </div>
            </div>

            {/* Auth */}
            <Link href="/sign-in" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-2.5 text-[14px] font-medium rounded-sm">
              <User size={14} /> Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
