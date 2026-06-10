'use client';

import { useState, useEffect } from 'react';
import { getTickets, type ZGTicket } from '@/lib/zain-tickets';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  X, Mail, Phone, Clock, Package,
  FileText, BarChart2, MessageSquare, ShoppingCart, ArrowRight,
  Shield, Download, ChevronDown,
  Bell, Ticket, ChevronRight, Trash2, LogOut, User
} from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────────────────────

const mockUser = {
  firstName: 'Ravi', lastName: 'Sharma',
  email: 'ravi.sharma@gulf-enterprises.ae',
  phone: '+971 50 123 4567',
  role: 'Chief Technology Officer',
  company: 'Gulf Enterprises LLC',
  memberSince: 'March 2024',
  avatar: 'RS',
};

const mockCompany = {
  name: 'Gulf Enterprises LLC',
  license: 'DED-2019-8847123',
  address: 'Al Quoz Industrial Area 2, Dubai, UAE',
  vatNumber: 'AE123456789012345',
  industry: 'Trading & Distribution',
  employees: '51–200',
  website: 'gulf-enterprises.ae',
};

const mockContact = {
  name: 'Deepa Rawat',
  title: 'Customer Success Manager',
  email: 'deepa@zoftwarehub.com',
  phone: '+971 4 000 0001',
  whatsapp: '+971550000001',
  avatar: 'DR',
  availability: 'Sun–Thu, 9am–6pm GST',
  online: true,
};

const mockPurchases = [
  {
    id: 'ORD-A1F3', name: 'Salesforce CRM', vendor: 'Salesforce', logo: 'SF',
    plan: 'Enterprise', licenses: 10, billing: 'Annual', price: '$1,200/mo',
    status: 'Active', activatedOn: '15 Apr 2025', nextRenewal: '15 Apr 2026',
    type: 'software', slug: 'salesforce', department: 'Sales',
    holders: [
      { name: 'Ravi Sharma', email: 'ravi.sharma@gulf-enterprises.ae', role: 'Admin / Owner' },
      { name: 'Aisha Al-Mansoori', email: 'aisha.m@gulf-enterprises.ae', role: 'Sales Lead' },
      { name: 'John Doe', email: 'john.doe@gulf-enterprises.ae', role: 'Sales Agent' },
    ],
  },
  {
    id: 'ORD-B8C2', name: 'Zoho Books', vendor: 'Zoho', logo: 'ZB',
    plan: 'Professional', licenses: 5, billing: 'Monthly', price: '$245/mo',
    status: 'Active', activatedOn: '01 Jun 2025', nextRenewal: '01 Jul 2026',
    type: 'software', slug: 'zoho-books', department: 'Finance',
    holders: [
      { name: 'Ravi Sharma', email: 'ravi.sharma@gulf-enterprises.ae', role: 'Billing Admin' },
      { name: 'Sarah Jenkins', email: 'sarah.j@gulf-enterprises.ae', role: 'Accountant' },
    ],
  },
  {
    id: 'ORD-C4D7', name: 'Freshdesk', vendor: 'Freshworks', logo: 'FD',
    plan: 'Growth', licenses: 5, billing: 'Monthly', price: '$75/mo',
    status: 'Activating', activatedOn: '—', nextRenewal: '—',
    type: 'software', slug: 'freshdesk', department: 'Customer Support',
    holders: [
      { name: 'Ravi Sharma', email: 'ravi.sharma@gulf-enterprises.ae', role: 'Admin' },
      { name: 'Michael Chang', email: 'michael.c@gulf-enterprises.ae', role: 'Support Agent' },
    ],
  },
  {
    id: 'BND-001', name: 'Growth Bundle', vendor: 'Zoftware', logo: 'GB',
    plan: 'Bundle', licenses: 1, billing: 'Annual', price: '$599/mo',
    status: 'Active', activatedOn: '10 Mar 2025', nextRenewal: '10 Mar 2026',
    type: 'bundle', slug: 'growth', department: 'Operations',
    holders: [
      { name: 'Ravi Sharma', email: 'ravi.sharma@gulf-enterprises.ae', role: 'Primary Holder' },
    ],
  },
];

const mockCart = [
  {
    id: 'CRT-001', name: 'Freshsales CRM', vendor: 'Freshworks', logo: 'FS',
    plan: 'Pro', licenses: 15, billing: 'Monthly', price: 150,
    type: 'software', slug: 'freshsales', addedOn: '2 hours ago', category: 'CRM & Sales',
    originalPrice: 175, discountPct: 14,
  },
  {
    id: 'CRT-002', name: 'Zoho Analytics', vendor: 'Zoho', logo: 'ZA',
    plan: 'Standard', licenses: 5, billing: 'Annual', price: 30,
    type: 'software', slug: 'zoho-analytics', addedOn: 'Yesterday', category: 'Analytics & BI',
    originalPrice: 45, discountPct: 33,
  },
  {
    id: 'CRT-003', name: 'Starter Bundle', vendor: 'Zoftware', logo: 'SB',
    plan: 'Starter', licenses: 1, billing: 'Monthly', price: 299,
    type: 'bundle', slug: 'starter', addedOn: '3 days ago', category: 'Bundle',
    originalPrice: 499, discountPct: 40,
  },
];

const mockRfpReports = [
  {
    id: 'RFP-2025-001', title: 'CRM & Sales Automation RFP', date: '12 May 2025',
    status: 'Completed',
    summary: 'Evaluated 6 CRM platforms. Top recommendation: Salesforce Enterprise with 94% match score.',
    matched: ['Salesforce CRM', 'Zoho CRM', 'HubSpot CRM'], score: '94%',
  },
  {
    id: 'RFP-2025-002', title: 'Finance & Accounting Tech RFP', date: '03 Jun 2025',
    status: 'Completed',
    summary: 'Focused on GCC-compliant accounting with VAT. Zoho Books rated highest for mid-market.',
    matched: ['Zoho Books', 'QuickBooks Online', 'Xero'], score: '88%',
  },
];

const mockStrategyReports = [
  {
    id: 'STR-2025-001', title: 'Digital Transformation Roadmap — ERP', date: '20 Apr 2025',
    status: 'Completed',
    phases: ['Phase 1: Core ERP (SAP B1)', 'Phase 2: CRM Integration', 'Phase 3: Analytics & BI'],
    summary: 'Three-phase 18-month roadmap prioritising operational ERP rollout followed by customer experience layer.',
  },
];

const mockTickets = [
  {
    id: 'TKT-8841', subject: 'Salesforce CRM — SSO configuration assistance',
    status: 'Open', priority: 'Medium', created: '28 May 2025',
    lastUpdate: '2 hours ago', agent: 'Deepa Rawat',
  },
  {
    id: 'TKT-7923', subject: 'Invoice request for Zoho Books — Q2 2025',
    status: 'Resolved', priority: 'Low', created: '05 Apr 2025',
    lastUpdate: '10 Apr 2025', agent: 'Deepa Rawat',
  },
];

const mockChats = [
  { date: 'Today', summary: 'Asked about Freshdesk activation timeline', bot: 'Zain AI' },
  { date: '3 days ago', summary: 'Compared HubSpot vs Salesforce pricing for 20 users', bot: 'Zain AI' },
  { date: '1 week ago', summary: 'Queried bundle upgrade options', bot: 'Zain AI' },
];

// ── Types & helpers ────────────────────────────────────────────────────────

type Tab = 'purchases' | 'cart' | 'reports' | 'support';

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    Active: 'bg-[#dcfce7] text-[#16a34a]',
    Activating: 'bg-[#fef3c7] text-[#d97706]',
    Resolved: 'bg-surface text-muted',
    Open: 'bg-[#fff7ed] text-[#ea580c]',
    Completed: 'bg-[#eff6ff] text-accent',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${cfg[status] || 'bg-surface text-muted'}`}>
      {status}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function UserProfilePanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('purchases');
  const [expandCompany, setExpandCompany] = useState(false);
  const [expandedHolders, setExpandedHolders] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState(mockCart);
  const [liveTickets, setLiveTickets] = useState<ZGTicket[]>([]);

  useEffect(() => {
    setLiveTickets(getTickets());
    const handler = () => setLiveTickets(getTickets());
    window.addEventListener('zg-tickets-updated', handler);
    return () => window.removeEventListener('zg-tickets-updated', handler);
  }, []);

  const toggleHolders = (id: string) =>
    setExpandedHolders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const removeFromCart = (id: string) =>
    setCartItems(prev => prev.filter(item => item.id !== id));

  const handleLogout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('dc_v2_auth');
    onClose();
    router.push('/dubai-chamber');
  };

  // Merge mock tickets with live Zain-created tickets
  const allTickets = [...liveTickets.map(t => ({
    id: t.id, subject: t.subject, status: t.status,
    priority: t.priority, created: t.created, lastUpdate: 'Just now', agent: t.agent,
  })), ...mockTickets];
  const openTickets = allTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const cartTotal = cartItems.reduce((s, i) => s + i.price, 0);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'purchases', label: 'Purchases',  icon: <Package size={14} strokeWidth={1.6} />, badge: mockPurchases.length },
    { id: 'cart',      label: 'Cart',       icon: <ShoppingCart size={14} strokeWidth={1.6} />, badge: cartItems.length },
    { id: 'reports',   label: 'Reports',    icon: <FileText size={14} strokeWidth={1.6} />, badge: mockRfpReports.length + mockStrategyReports.length },
    { id: 'support',   label: 'Support',    icon: <Ticket size={14} strokeWidth={1.6} />, badge: openTickets || undefined },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Full-screen panel */}
      <div className="fixed inset-0 z-50 bg-white flex flex-col"
        style={{ animation: 'panelIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
        <style>{`
          @keyframes panelIn { from { opacity: 0; transform: scale(0.98) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        `}</style>

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="shrink-0 h-12 border-b border-black/8 flex items-center justify-between px-5 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
              {mockUser.avatar}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-black">{mockUser.firstName} {mockUser.lastName}</p>
              <span className="text-[#c7c7cc]">·</span>
              <p className="text-[12px] text-muted hidden sm:block">{mockUser.role} · {mockUser.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface text-muted hover:text-black transition-colors relative">
              <Bell size={14} />
              {openTickets > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ea580c]" />}
            </button>
            <button onClick={handleLogout}
              title="Sign out"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-muted hover:text-red-500 transition-colors">
              <LogOut size={14} />
            </button>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface text-muted hover:text-black transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body: sidebar + content ──────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden lg:flex flex-col w-[260px] border-r border-black/8 bg-[#f9fafb] shrink-0">

            {/* Quick stats */}
            <div className="grid grid-cols-3 border-b border-black/8 divide-x divide-black/8">
              {[
                { v: mockPurchases.length.toString(), l: 'Active', sub: 'products' },
                { v: (mockRfpReports.length + mockStrategyReports.length).toString(), l: 'Reports', sub: 'saved' },
                { v: openTickets.toString(), l: 'Open', sub: 'tickets', alert: openTickets > 0 },
              ].map(({ v, l, sub, alert }) => (
                <div key={l} className="py-3 text-center">
                  <p className={`text-[18px] font-semibold leading-none mb-0.5 ${alert ? 'text-[#ea580c]' : 'text-black'}`}>{v}</p>
                  <p className="text-[9px] text-muted">{l}</p>
                  <p className="text-[9px] text-[#c7c7cc]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Nav tabs */}
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left text-[13px] font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-black text-white'
                      : 'text-[#555] hover:bg-white hover:text-black'
                  }`}>
                  <span className={tab === t.id ? 'text-white' : 'text-muted'}>{t.icon}</span>
                  <span className="flex-1">{t.label}</span>
                  {t.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                      tab === t.id ? 'bg-white/20 text-white' : 'bg-[#f0f0f0] text-muted'
                    }`}>{t.badge}</span>
                  )}
                </button>
              ))}

              {/* Sign out */}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left text-[13px] font-medium text-muted hover:bg-red-50 hover:text-red-500 transition-colors mt-1">
                <LogOut size={14} className="shrink-0" />
                Sign out
              </button>
            </nav>

            {/* ── CSM card — always visible at bottom ── */}
            <div className="csm-card shrink-0 border-t border-black/8 overflow-hidden">
              <div className="p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Your Success Manager
                </p>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}>
                    {mockContact.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white leading-tight truncate">{mockContact.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse shrink-0" />
                      <p className="text-[10px] font-medium" style={{ color: '#4ade80' }}>Online now</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3.5">
                  {[
                    { icon: <Mail size={10} />, v: mockContact.email },
                    { icon: <Phone size={10} />, v: mockContact.phone },
                    { icon: <Clock size={10} />, v: mockContact.availability },
                  ].map(({ icon, v }) => (
                    <div key={v} className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.55)' }} className="shrink-0">{icon}</span>
                      <span className="truncate">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${mockContact.email}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-sm transition-colors"
                    style={{ background: '#fff', color: 'var(--color-accent)' }}>
                    <Mail size={11} /> Email
                  </a>
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-sm transition-colors text-white"
                    style={{ background: 'var(--color-accent)' }}
                    onClick={() => {
                      const chatEl = document.querySelector('[title="Minimise chat"]')?.closest('button');
                      if (chatEl) chatEl.click();
                      window.dispatchEvent(new CustomEvent('zain-open'));
                    }}>
                    <MessageSquare size={11} /> Chat
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 overflow-y-auto bg-white">

            {/* Mobile tabs (shown below lg) */}
            <div className="lg:hidden flex border-b border-black/8 overflow-x-auto sticky top-0 bg-white z-10">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold border-b-2 whitespace-nowrap shrink-0 transition-colors ${
                    tab === t.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-black'
                  }`}>
                  {t.label}
                  {t.badge !== undefined && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      tab === t.id ? 'bg-accent text-white' : 'bg-surface text-muted'
                    }`}>{t.badge}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Page header */}
            <div className="border-b border-black/8 px-6 lg:px-10 py-5">
              <h1 className="text-[22px] font-semibold text-black tracking-tight">
                {tab === 'purchases' && 'Purchases & Subscriptions'}
                {tab === 'cart' && 'My Cart'}
                {tab === 'reports' && 'Saved Reports'}
                {tab === 'support' && 'Support & Help'}
              </h1>
              <p className="text-[13px] text-muted mt-1">
                {tab === 'purchases' && `${mockPurchases.length} active subscriptions · $1,520/mo`}
                {tab === 'cart' && `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} · $${cartTotal}/mo estimated`}
                {tab === 'reports' && `${mockRfpReports.length + mockStrategyReports.length} reports generated`}
                {tab === 'support' && `${openTickets} open ticket${openTickets !== 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Two-column content layout */}
            <div className="px-6 lg:px-10 py-6">
            <div className="flex gap-7 items-start">
            <div className="flex-1 min-w-0">

              {/* ─── PURCHASES ─── */}
              {tab === 'purchases' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-muted">{mockPurchases.length} active subscriptions</p>
                    <Link href="/software" onClick={onClose}
                      className="text-[12px] font-semibold text-accent hover:text-accent-hover flex items-center gap-1">
                      Browse more <ArrowRight size={11} />
                    </Link>
                  </div>

                  {mockPurchases.map(p => (
                    <div key={p.id} className="border border-black/8 rounded-sm overflow-hidden hover:border-black/16 hover:shadow-sm transition-all group">
                      <div
                        className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                        onClick={() => { onClose(); router.push(p.type === 'bundle' ? `/bundles/${p.slug}` : `/software/product/${p.slug}`); }}
                      >
                        <div className="w-11 h-11 rounded-sm bg-surface border border-black/8 flex items-center justify-center shrink-0">
                          <span className="text-[12px] font-bold text-black">{p.logo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[14px] font-semibold text-black group-hover:text-accent transition-colors truncate">{p.name}</p>
                            <StatusBadge status={p.status} />
                          </div>
                          <p className="text-[12px] text-muted">
                            {p.vendor} · {p.plan} · {p.licenses} {p.type === 'bundle' ? 'bundle' : 'users'} · {p.department}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[15px] font-semibold text-black">{p.price}</p>
                          <p className="text-[11px] text-muted">{p.billing}</p>
                        </div>
                      </div>

                      <div className="border-t border-black/6 px-5 py-2.5 flex items-center justify-between bg-[#f9fafb]">
                        <div className="text-[11px] text-muted flex items-center gap-3">
                          {p.status === 'Activating' ? (
                            <span className="flex items-center gap-1 text-[#d97706]">
                              <Clock size={10} /> Activation in progress
                            </span>
                          ) : (
                            <>
                              <span>Activated {p.activatedOn}</span>
                              <span className="text-[#c7c7cc]">·</span>
                              <span>Renews {p.nextRenewal}</span>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => toggleHolders(p.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover bg-accent/5 hover:bg-accent/10 px-2 py-0.5 rounded-sm transition-colors">
                          Holders
                          <ChevronDown size={10} className={`transition-transform ${expandedHolders.includes(p.id) ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {expandedHolders.includes(p.id) && (
                        <div className="border-t border-black/6 bg-white px-5 py-3 space-y-2">
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">
                            License Holders ({p.licenses} total)
                          </p>
                          <div className="divide-y divide-black/4">
                            {p.holders.map((h, i) => (
                              <div key={i} className="py-2 flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-[12px] font-semibold text-black">{h.name}</p>
                                  <p className="text-[10px] text-muted font-mono">{h.email}</p>
                                </div>
                                <span className="text-[10px] bg-surface text-[#555] px-2 py-0.5 rounded-sm font-medium shrink-0">{h.role}</span>
                              </div>
                            ))}
                          </div>
                          {p.licenses > p.holders.length && (
                            <p className="text-[10px] text-muted italic pt-1 border-t border-black/6">
                              + {p.licenses - p.holders.length} unassigned licenses remaining
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Spend summary */}
                  <div className="border border-accent/15 bg-[#eff6ff] rounded-sm p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-accent mb-1">Monthly spend</p>
                      <p className="text-[28px] font-semibold text-black">$1,520</p>
                      <p className="text-[12px] text-muted">across all active subscriptions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-semibold text-[#16a34a]">Saving $680/mo</p>
                      <p className="text-[11px] text-muted">vs list prices</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── CART ─── */}
              {tab === 'cart' && (
                <div className="space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-black/10 rounded-sm">
                      <ShoppingCart size={32} className="text-[#c7c7cc] mx-auto mb-3" strokeWidth={1.2} />
                      <p className="text-[14px] font-semibold text-black mb-1">Your cart is empty</p>
                      <p className="text-[12px] text-muted mb-4">Browse software or bundles to add items</p>
                      <Link href="/software" onClick={onClose}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors">
                        Browse Software <ArrowRight size={11} />
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] text-muted">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                        <Link href="/software" onClick={onClose}
                          className="text-[12px] font-semibold text-accent hover:text-accent-hover flex items-center gap-1">
                          Add more <ArrowRight size={11} />
                        </Link>
                      </div>

                      {cartItems.map(item => (
                        <div key={item.id} className="border border-black/8 rounded-sm overflow-hidden hover:border-black/16 transition-all group">
                          <div className="flex items-center gap-4 px-5 py-4">
                            <div className="w-11 h-11 rounded-sm bg-surface border border-black/8 flex items-center justify-center shrink-0">
                              <span className="text-[12px] font-bold text-black">{item.logo}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[14px] font-semibold text-black truncate">{item.name}</p>
                                {item.type === 'bundle' && (
                                  <span className="text-[9px] font-bold bg-accent text-white px-1.5 py-0.5 rounded-sm shrink-0">BUNDLE</span>
                                )}
                              </div>
                              <p className="text-[12px] text-muted">
                                {item.vendor} · {item.plan} · {item.licenses} {item.type === 'bundle' ? 'bundle' : `user${item.licenses !== 1 ? 's' : ''}`} · {item.category}
                              </p>
                              <p className="text-[10px] text-[#c7c7cc] mt-0.5">Added {item.addedOn}</p>
                            </div>
                            <div className="text-right shrink-0 mr-2">
                              <p className="text-[15px] font-semibold text-black">${item.price}<span className="text-[11px] text-muted font-normal">/mo</span></p>
                              {item.originalPrice > item.price && (
                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                  <p className="text-[10px] text-muted line-through">${item.originalPrice}</p>
                                  <span className="text-[9px] font-bold bg-[#dcfce7] text-[#16a34a] px-1 py-0.5 rounded-sm">{item.discountPct}% off</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-sm text-[#c7c7cc] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="border-t border-black/6 px-5 py-2.5 flex items-center justify-between bg-[#f9fafb]">
                            <span className="text-[11px] text-muted">{item.billing} billing</span>
                            <Link
                              href={item.type === 'bundle' ? `/checkout?bundle=${item.slug}` : `/checkout?product=${item.slug}&price=${item.price}&billing=${item.billing.toLowerCase()}`}
                              onClick={onClose}
                              className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover transition-colors">
                              Checkout <ChevronRight size={10} />
                            </Link>
                          </div>
                        </div>
                      ))}

                      {/* Cart summary + checkout CTA */}
                      <div className="border border-black/8 rounded-sm p-5 bg-[#f9fafb]">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[13px] font-semibold text-black">Order summary</p>
                        </div>
                        <div className="space-y-2 mb-4">
                          {cartItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-[12px]">
                              <span className="text-[#555]">{item.name} ({item.plan})</span>
                              <span className="font-semibold text-black">${item.price}/mo</span>
                            </div>
                          ))}
                          <div className="border-t border-black/8 pt-2 flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-black">Total</span>
                            <span className="text-[16px] font-semibold text-black">${cartTotal}/mo</span>
                          </div>
                        </div>
                        <Link
                          href={`/checkout?product=${cartItems[0]?.slug}&price=${cartItems[0]?.price}&billing=${cartItems[0]?.billing?.toLowerCase()}`}
                          onClick={onClose}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-white text-[13px] font-semibold rounded-sm transition-colors">
                          Proceed to Checkout <ArrowRight size={13} />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ─── REPORTS ─── */}
              {tab === 'reports' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-sm flex items-center justify-center bg-accent">
                        <FileText size={13} className="text-white" />
                      </div>
                      <p className="text-[13px] font-semibold text-black">Tech Requirement Reports</p>
                      <span className="ml-auto text-[10px] font-semibold bg-surface text-muted px-2 py-0.5 rounded-full">{mockRfpReports.length} reports</span>
                    </div>
                    <div className="space-y-3">
                      {mockRfpReports.map(r => (
                        <div key={r.id} className="border border-black/8 rounded-sm p-5 hover:border-black/16 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[14px] font-semibold text-black">{r.title}</p>
                            <StatusBadge status={r.status} />
                          </div>
                          <p className="text-[12px] text-[#555] leading-snug mb-3">{r.summary}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {r.matched.map(m => <span key={m} className="text-[10px] bg-surface text-[#555] px-2 py-0.5 rounded-sm">{m}</span>)}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-[11px] text-muted">
                              <span>{r.date}</span>
                              <span className="font-semibold text-accent">Match: {r.score}</span>
                            </div>
                            <button className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:text-accent-hover">
                              <Download size={11} /> Download RFP
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-black/8" />

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-sm flex items-center justify-center bg-accent-hover">
                        <BarChart2 size={13} className="text-white" />
                      </div>
                      <p className="text-[13px] font-semibold text-black">Tech Strategy Reports</p>
                      <span className="ml-auto text-[10px] font-semibold bg-surface text-muted px-2 py-0.5 rounded-full">{mockStrategyReports.length} report</span>
                    </div>
                    <div className="space-y-3">
                      {mockStrategyReports.map(r => (
                        <div key={r.id} className="border border-black/8 rounded-sm p-5 hover:border-black/16 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[14px] font-semibold text-black">{r.title}</p>
                            <StatusBadge status={r.status} />
                          </div>
                          <p className="text-[12px] text-[#555] leading-snug mb-3">{r.summary}</p>
                          <div className="space-y-1.5 mb-3">
                            {r.phases.map((ph, i) => (
                              <div key={ph} className="flex items-center gap-2 text-[12px] text-[#555]">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                                  style={{ backgroundColor: i === 0 ? 'var(--color-accent)' : i === 1 ? 'var(--color-accent-hover)' : '#000' }}>
                                  {i + 1}
                                </span>
                                {ph}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted">{r.date}</span>
                            <button className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:text-accent-hover">
                              <Download size={11} /> Download Roadmap
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-black/8 rounded-sm p-5 bg-[#f9fafb] text-center">
                    <p className="text-[13px] font-semibold text-black mb-1">Generate a new report</p>
                    <p className="text-[12px] text-muted mb-4">Use our AI builders to create RFPs or tech roadmaps instantly</p>
                    <div className="flex gap-3 max-w-sm mx-auto">
                      <Link href="/software?mode=requirements" onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold bg-accent text-white rounded-sm hover:bg-accent-hover transition-colors">
                        <FileText size={12} /> RFP Builder
                      </Link>
                      <Link href="/software?mode=strategy" onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold border border-black/10 text-black rounded-sm hover:bg-[#f0f0f0] transition-colors">
                        <BarChart2 size={12} /> Strategy Builder
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── SUPPORT ─── */}
              {tab === 'support' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[13px] font-semibold text-black">Support Tickets</p>
                      <button className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:text-accent-hover">
                        <Ticket size={11} /> New ticket
                      </button>
                    </div>
                    <div className="space-y-3">
                      {allTickets.map(t => (
                        <div key={t.id} className="border border-black/8 rounded-sm p-5 hover:border-black/16 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[13px] font-semibold text-black">{t.subject}</p>
                            <StatusBadge status={t.status} />
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted mt-2">
                            <span className="font-mono">{t.id}</span>
                            <span>·</span>
                            <span>{t.priority} priority</span>
                            <span>·</span>
                            <span>Updated {t.lastUpdate}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-[12px] text-[#555]">
                            <User size={11} className="text-muted" /> Assigned to {t.agent}
                          </div>
                          {t.status === 'Open' && (
                            <button className="mt-2 text-[12px] font-semibold text-accent hover:text-accent-hover flex items-center gap-1">
                              View thread <ChevronRight size={11} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-black/8" />

                  <div>
                    <p className="text-[13px] font-semibold text-black mb-4">Zain AI Chat History</p>
                    <div className="space-y-2">
                      {mockChats.map((c, i) => (
                        <div key={i} className="flex items-start gap-3 border border-black/8 rounded-sm p-4">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                            <MessageSquare size={13} className="text-white" />
                          </div>
                          <div>
                            <p className="text-[13px] text-black">{c.summary}</p>
                            <p className="text-[10px] text-muted mt-1">{c.date} · {c.bot}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-black/8" />

                  <div className="border border-black/8 rounded-sm p-5">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">Reach Support</p>
                    <div className="space-y-3 mb-4">
                      {[
                        { icon: <Mail size={13} />, label: 'Email', value: 'support@zoftware.com', href: 'mailto:support@zoftware.com' },
                        { icon: <Phone size={13} />, label: 'Toll-free', value: '800 ZOFT (9638)', href: 'tel:8009638' },
                        { icon: <MessageSquare size={13} />, label: 'WhatsApp', value: '+971 55 000 0000', href: 'https://wa.me/971550000000' },
                      ].map(({ icon, label, value, href }) => (
                        <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          className="flex items-center gap-3 hover:text-accent transition-colors group">
                          <span className="text-muted group-hover:text-accent">{icon}</span>
                          <span className="text-[12px] text-muted w-20 shrink-0">{label}</span>
                          <span className="text-[13px] font-medium text-black group-hover:text-accent">{value}</span>
                        </a>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted bg-surface rounded-sm px-3 py-2">
                      <Clock size={11} />
                      Support hours: Sun–Thu 9am–6pm GST · Priority SLA: 4 hours
                    </div>
                  </div>
                </div>
              )}

            </div>{/* end left col */}

                {/* ── RIGHT PANEL: account summary only ── */}
                <div className="hidden xl:block w-[240px] shrink-0 sticky top-0 self-start">
                  <div className="border border-black/8 rounded-sm overflow-hidden">
                    <div className="px-4 py-3 bg-[#f9fafb] border-b border-black/8">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.08em]">Account Summary</p>
                    </div>
                    <div className="divide-y divide-black/6">
                      {[
                        { v: mockPurchases.length.toString(), l: 'Active subscriptions', c: 'var(--color-accent)' },
                        { v: '$1,520/mo', l: 'Monthly spend', c: '#000' },
                        { v: '$680 saved', l: 'vs list price', c: '#16a34a' },
                        { v: cartItems.length.toString(), l: 'Items in cart', c: '#000' },
                      ].map(({ v, l, c }) => (
                        <div key={l} className="flex items-center justify-between px-4 py-3">
                          <span className="text-[12px] text-muted">{l}</span>
                          <span className="text-[13px] font-bold" style={{ color: c }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>{/* end two-col flex */}
            </div>{/* end px wrapper */}
          </main>
        </div>
      </div>
    </>
  );
}
