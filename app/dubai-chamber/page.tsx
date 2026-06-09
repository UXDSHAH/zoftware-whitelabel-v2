'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Search, ChevronDown, ChevronRight, Menu, X, Globe, Phone,
  ArrowRight, Sparkles, FileText, BarChart2, MessageSquare, Zap,
  Shield, Users, Building2, ExternalLink, TrendingUp, Star, Package, Check,
  Eye, EyeOff, Lock, TrendingDown
} from 'lucide-react';

// ─── Login credentials (update when real creds are provided) ─────────────────
const AUTH_USER = 'admin';
const AUTH_PASS = 'v2access';
const AUTH_KEY  = 'dc_v2_auth';

// ─── Nav structure ────────────────────────────────────────────────────────────
const navItems = [
  {
    label: 'About',
    href: 'https://www.dubaichambercommerce.com/en/about-dubai-chambers-of-commerce',
    children: [
      { label: 'About Dubai Chamber of Commerce', href: 'https://www.dubaichambercommerce.com/en/about-dubai-chambers-of-commerce' },
      { label: 'Board Members & Advisory Councils', href: 'https://www.dubaichambercommerce.com/en/board-members-and-advisory-councils' },
    ],
  },
  {
    label: 'Business Hub',
    href: '#',
    children: [
      { label: 'Become a Member', href: 'https://www.dubaichambers.com/new-membership' },
      { label: 'Business Groups & Business Councils', href: 'https://www.dubaichambercommerce.com/en/business-groups-business-councils' },
      { label: 'Centre for Responsible Business', href: 'https://www.dubaichambercommerce.com/en/centre-for-responsible-business' },
      { label: 'Policy Advocacy', href: 'https://www.dubaichambercommerce.com/en/policy-advocacy' },
      { label: 'Business Growth', href: 'https://www.dubaichambercommerce.com/en/business-growth' },
    ],
  },
  {
    label: 'Services',
    href: 'https://www.dubaichambers.com/services',
    children: [
      { label: 'Membership', href: 'https://www.dubaichambers.com/services?category=271644' },
      { label: 'Certificate of Origin', href: 'https://www.dubaichambers.com/services?category=275773' },
      { label: 'Attestation', href: 'https://www.dubaichambers.com/services?category=276199' },
      { label: 'ATA Carnet', href: 'https://www.dubaichambers.com/services?category=276345' },
      { label: 'Mediation', href: 'https://www.dubaichambers.com/services?category=277640' },
      { label: 'Venue Booking', href: 'https://www.dubaichambers.com/services?category=4139694' },
    ],
  },
  {
    label: 'Knowledge Centre',
    href: '#',
    children: [
      { label: 'Resource Toolkit', href: 'https://www.dubaichambers.com/resources' },
      { label: 'Commercial Directory', href: 'https://dcdigitalservices.dubaichamber.com/' },
      { label: 'Family Businesses', href: 'https://www.dubaichambercommerce.com/en/dubai-centre-for-family-businesses' },
    ],
  },
  {
    label: "What's On",
    href: '#',
    children: [
      { label: 'Events', href: 'https://www.dubaichambers.com/en/events' },
      { label: 'News', href: 'https://www.dubaichambercommerce.com/en/news' },
    ],
  },
];

const news = [
  { title: 'Dubai Chamber of Commerce concludes Addis Ababa trade mission with a record 510 B2B meetings, the highest since launching its trade mission initiative', date: 'June 2026', href: 'https://www.dubaichambercommerce.com/en/news', featured: true },
  { title: 'Dubai Chamber and Abu Dhabi Early Childhood Authority host webinar to promote Parent-friendly Label programme among private sector', date: 'June 2026', href: 'https://www.dubaichambercommerce.com/en/news' },
  { title: 'Dubai Chamber organises 276 bilateral business meetings in Accra to strengthen trade cooperation between companies in Dubai and Ghana', date: 'May 2026', href: 'https://www.dubaichambercommerce.com/en/news' },
  { title: "Dubai Chamber spotlights DP World's Cargo War Risk Insurance programme at Export Majlis", date: 'May 2026', href: 'https://www.dubaichambercommerce.com/en/news' },
  { title: 'Dubai Chamber records highest monthly membership renewal in its history — 30,000+ renewals in April 2026', date: 'April 2026', href: 'https://www.dubaichambercommerce.com/en/news' },
];

const stats = [
  { value: '292,486', label: 'Active member companies', icon: <Building2 size={16} strokeWidth={1.5} /> },
  { value: '71,830', label: 'New member companies joined', icon: <TrendingUp size={16} strokeWidth={1.5} /> },
  { value: '852,184', label: 'Certificates of origin issued', icon: <Star size={16} strokeWidth={1.5} /> },
  { value: 'AED 356.5Bn', label: 'Value of member exports', icon: <Shield size={16} strokeWidth={1.5} /> },
  { value: 'AED 5.6Bn', label: 'Value of ATA Carnets issued and received', icon: <Package size={16} strokeWidth={1.5} /> },
  { value: '54', label: 'Laws & draft laws reviewed — 60% adoption rate for private sector', icon: <Shield size={16} strokeWidth={1.5} /> },
  { value: '40', label: 'Legal awareness workshops — 2,611 participants', icon: <Users size={16} strokeWidth={1.5} /> },
  { value: '201', label: 'Mediation cases — AED 241M total case value', icon: <Star size={16} strokeWidth={1.5} /> },
];

const services = [
  { name: 'Membership', desc: 'Register your mainland or free zone company and access the full chamber network, enjoying numerous services and programmes.', href: 'https://www.dubaichambers.com/services?category=271644' },
  { name: 'Certificate of Origin', desc: 'Official document determining the origin of exported or re-exported goods — essential for customs tariffs and trade shipments.', href: 'https://www.dubaichambers.com/services?category=275773' },
  { name: 'Attestation', desc: 'Simplifying business by attesting commercial documents, correspondence and contracts for acceptance by concerned authorities.', href: 'https://www.dubaichambers.com/services?category=276199' },
  { name: 'Expansion Services', desc: 'Expert guidance backed by a global network of International Offices — helping members enter new markets and strengthen their global presence.', href: 'https://www.dubaichambercommerce.com/en/new-horizons' },
  { name: 'ATA Carnet', desc: 'International customs document enabling temporary import/export of goods duty-free across borders.', href: 'https://www.dubaichambers.com/services?category=276345' },
  { name: 'Mediation', desc: '201 mediation cases handled with AED 241 million total case value — cost-effective dispute resolution for businesses.', href: 'https://www.dubaichambers.com/services?category=277640' },
];

const gatewayTools = [
  {
    icon: <Search size={20} strokeWidth={1.5} />,
    label: 'Smart Search',
    desc: 'Find the right software from 50+ verified products in seconds.',
    href: '/software?mode=search',
    color: '#007AFF',
    external: false,
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    label: 'Tech Requirement Builder',
    desc: 'Generate a detailed technical requirements document for your procurement.',
    href: '/software?mode=requirements',
    color: '#0051D5',
    external: false,
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    label: 'Tech Strategy Builder',
    desc: 'Get a full tech strategy and implementation roadmap in under 1 minute.',
    href: '/software?mode=strategy',
    color: '#007AFF',
    external: false,
  },
  {
    icon: <TrendingDown size={20} strokeWidth={1.5} />,
    label: 'Cost Optimizer',
    desc: 'Analyse your current software spend and uncover savings opportunities instantly.',
    href: 'COST_OPTIMIZER_URL',
    color: '#16a34a',
    external: true,
  },
];

export default function DubaiChamberPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);

  // ── Login wall ────────────────────────────────────────────────────────────
  const [authReady,  setAuthReady]  = useState(false);
  const [authed,     setAuthed]     = useState(false);
  const [loginUser,  setLoginUser]  = useState('');
  const [loginPass,  setLoginPass]  = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [loginErr,   setLoginErr]   = useState('');
  const [logging,    setLogging]    = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem(AUTH_KEY);
    if (stored === 'true') setAuthed(true);
    setAuthReady(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLogging(true);
    setTimeout(() => {
      if (loginUser.trim() === AUTH_USER && loginPass === AUTH_PASS) {
        localStorage.setItem(AUTH_KEY, 'true');
        setAuthed(true);
        setLoginErr('');
      } else {
        setLoginErr('Incorrect username or password.');
      }
      setLogging(false);
    }, 600);
  };

  // Render login wall until auth is confirmed
  if (!authReady) return null;

  if (!authed) return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        {/* Generic logo mark */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 bg-black rounded-sm flex items-center justify-center">
            <div className="grid grid-cols-2 gap-[3px]">
              {[0,1,2,3].map(i => <div key={i} className="w-[7px] h-[7px] bg-white rounded-[1px]" />)}
            </div>
          </div>
          <span className="text-[18px] font-bold text-black tracking-tight">LOGO</span>
        </div>

        <div className="bg-white border border-black/8 rounded-sm p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={15} className="text-[#007AFF]" />
            <p className="text-[15px] font-semibold text-black">Sign in to continue</p>
          </div>
          <p className="text-[12px] text-[#86868b] mb-6">This workspace is access-controlled.</p>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#86868b] mb-1.5 block">Username</span>
              <input
                type="text"
                value={loginUser}
                onChange={e => { setLoginUser(e.target.value); setLoginErr(''); }}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full h-10 border border-black/10 rounded-sm px-3 text-[13px] text-black outline-none focus:border-[#007AFF]/40 focus:ring-2 focus:ring-[#007AFF]/10 bg-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#86868b] mb-1.5 block">Password</span>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={e => { setLoginPass(e.target.value); setLoginErr(''); }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full h-10 border border-black/10 rounded-sm px-3 pr-10 text-[13px] text-black outline-none focus:border-[#007AFF]/40 focus:ring-2 focus:ring-[#007AFF]/10 bg-white"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-black transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {loginErr && (
              <p className="text-[12px] text-red-600 font-medium">{loginErr}</p>
            )}

            <button type="submit" disabled={logging || !loginUser || !loginPass}
              className="w-full h-10 bg-[#007AFF] hover:bg-[#0051D5] disabled:opacity-50 text-white text-[13px] font-semibold rounded-sm transition-colors flex items-center justify-center gap-2">
              {logging ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-center text-[11px] text-[#86868b] mt-4">
          Powered by <span className="font-semibold text-black">Zoftware</span> · Software Gateway V2
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── Top utility bar ──────────────────────────────────────── */}
      <div className="border-b border-black/8 bg-[#f9fafb]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <button className="text-[12px] text-[#86868b] hover:text-black transition-colors flex items-center gap-1.5">
            <Globe size={12} /> Explore Chambers
          </button>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#86868b] cursor-pointer hover:text-black transition-colors">عربي</span>
            <a href="https://connect.dubaichamber.com/" target="_blank" rel="noopener noreferrer"
              className="text-[12px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors">
              Login
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* Generic logo */}
          <Link href="/dubai-chamber" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[2.5px]">
                {[0,1,2,3].map(i => <div key={i} className="w-[6px] h-[6px] bg-white rounded-[1px]" />)}
              </div>
            </div>
            <span className="text-[15px] font-bold text-black tracking-tight">LOGO</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(item => (
              <div key={item.label} className="relative group">
                <button className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-[#333] hover:text-black rounded-sm hover:bg-[#f5f5f7] transition-colors">
                  {item.label}
                  {item.children && <ChevronDown size={11} className="text-[#86868b]" />}
                </button>
                {item.children && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-black/8 rounded-sm shadow-lg min-w-[240px] py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    {item.children.map(child => (
                      <a key={child.label} href={child.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f5f5f7] hover:text-black transition-colors">
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <a href="https://www.dubaichambers.com/services" target="_blank" rel="noopener noreferrer"
              className="text-[13px] font-medium text-[#555] hover:text-black transition-colors px-3 py-2">Services</a>
            <a href="https://www.dubaichambers.com/contact-us" target="_blank" rel="noopener noreferrer"
              className="text-[13px] font-medium text-[#555] hover:text-black transition-colors px-3 py-2">Contact Us</a>
            <a href="https://wa.me/9718002426237" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-black text-white text-[12px] font-semibold px-4 py-2 rounded-sm hover:bg-[#333] transition-colors min-h-[36px]">
              <MessageSquare size={13} /> Let&apos;s Chat
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-black hover:bg-[#f5f5f7] rounded-sm transition-colors">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 top-[105px]" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative bg-white border-b border-black/8 px-4 py-4 shadow-lg" onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <div key={item.label}>
                <button onClick={() => setOpenNav(openNav === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between px-2 py-3 text-[14px] font-medium text-black">
                  {item.label}
                  <ChevronDown size={14} className={`text-[#86868b] transition-transform ${openNav === item.label ? 'rotate-180' : ''}`} />
                </button>
                {openNav === item.label && item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map(child => (
                      <a key={child.label} href={child.href} target="_blank" rel="noopener noreferrer"
                        className="block py-2 text-[13px] text-[#555] hover:text-black">
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-black/8">
              <a href="https://wa.me/9718002426237" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-black text-white text-[14px] font-semibold py-3 rounded-sm">
                <MessageSquare size={15} /> Let&apos;s Chat
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Security notice ──────────────────────────────────────── */}
      <div className="bg-[#FFF8E7] border-b border-[#F5C518]/20 py-2.5 px-4">
        <p className="text-[12px] text-[#333] max-w-[1280px] mx-auto text-center">
          <span className="font-semibold">Security notice:</span> Be cautious of what you see online. Deepfakes and AI-generated content can mislead. Stay alert, verify before you trust.
        </p>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #f8fbff 50%, #ffffff 100%)' }}>
        {/* Dot-grid decorative background */}
        <div className="absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: 'radial-gradient(circle, #007AFF18 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        {/* Subtle blue glow top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #007AFF 0%, transparent 70%)', transform: 'translate(25%, -25%)' }} />
        {/* Subtle warm accent bottom-left */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #0051D5 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 border border-[#007AFF]/20 bg-[#007AFF]/6 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#007AFF] mb-6 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
                Dubai Chamber of Commerce
              </div>

              <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold text-black tracking-tight leading-[1.05] mb-5">
                Shaping Dubai&apos;s<br />
                <span className="text-[#007AFF]">Business Landscape.</span>
              </h1>
              <p className="text-[15px] sm:text-[17px] text-[#555] leading-[1.7] max-w-[460px] mb-8">
                Simplify your business set up in Dubai with extensive support, growth opportunities, and impactful connections across 30+ countries.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a href="https://www.dubaichambers.com/new-membership" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#007AFF] text-white px-6 py-3 text-[14px] font-semibold rounded-sm hover:bg-[#0051D5] transition-all min-h-[44px] shadow-lg shadow-[#007AFF]/20">
                  Become a Member <ArrowRight size={15} strokeWidth={2} />
                </a>
                <a href="https://www.dubaichambercommerce.com/en/business-groups-business-councils" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-black/15 text-black px-6 py-3 text-[14px] font-medium rounded-sm hover:bg-[#f5f5f7] hover:border-black/25 transition-all min-h-[44px]">
                  Business Groups & Councils
                </a>
              </div>

              {/* Trust mini-strip */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-black/8">
                {[
                  { n: '292K+', l: 'Active members' },
                  { n: '1965', l: 'Est. in Dubai' },
                  { n: '30+', l: 'Countries' },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <p className="text-[18px] font-semibold text-black">{n}</p>
                    <p className="text-[11px] text-[#86868b]">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero cards — right column */}
            <div className="space-y-3">
              {[
                { title: 'Family Businesses', desc: 'Access strategic partnerships to drive sector growth and innovation.', href: 'https://www.dubaichambercommerce.com/en/dubai-centre-for-family-businesses', tag: 'Centre' },
                { title: 'Become a Member', desc: 'Access a wide range of benefits including easy registration and expert guidance.', href: 'https://www.dubaichambers.com/new-membership', tag: 'Apply now' },
                { title: 'Business Groups & Councils', desc: 'Shape policies, expand trade, and enhance governance for the private sector.', href: 'https://www.dubaichambercommerce.com/en/business-groups-business-councils', tag: '200+ groups' },
              ].map(card => (
                <a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between border border-black/8 bg-white rounded-sm px-5 py-4 hover:border-[#007AFF]/25 hover:bg-[#f8fbff] hover:shadow-sm transition-all group">
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[14px] font-semibold text-black">{card.title}</p>
                      <span className="text-[9px] font-bold text-[#007AFF] bg-[#007AFF]/10 px-1.5 py-0.5 rounded-sm shrink-0">{card.tag}</span>
                    </div>
                    <p className="text-[12px] text-[#86868b] leading-snug hidden sm:block">{card.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#c7c7cc] group-hover:text-[#007AFF] transition-colors shrink-0" />
                </a>
              ))}

              {/* Bottom CTA in hero cards */}
              <Link href="/software"
                className="flex items-center justify-between border border-[#007AFF]/25 bg-[#007AFF]/6 rounded-sm px-5 py-4 hover:bg-[#007AFF]/12 hover:border-[#007AFF]/40 transition-all group">
                <div>
                  <p className="text-[14px] font-semibold text-black flex items-center gap-2">
                    <Zap size={14} className="text-[#007AFF]" />
                    Software Gateway
                  </p>
                  <p className="text-[12px] text-[#86868b] mt-0.5">Browse 50+ business software tools</p>
                </div>
                <span className="text-[11px] font-semibold text-[#007AFF] border border-[#007AFF]/30 px-2.5 py-1 rounded-sm group-hover:bg-[#007AFF] group-hover:text-white transition-all shrink-0">
                  Explore →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOFTWARE GATEWAY ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
        {/* Subtle background orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.07]"
          style={{ background: 'radial-gradient(ellipse, #007AFF 0%, transparent 70%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 border-b border-black/8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#007AFF] text-white px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-[0.1em] uppercase mb-4 shadow-sm shadow-[#007AFF]/30">
                <Zap size={11} strokeWidth={2.5} /> Software Gateway
              </div>
              <h2 className="text-[26px] sm:text-[36px] font-medium text-black tracking-tight leading-[1.1] mb-3">
                Procure the right software.<br />
                <span className="text-[#007AFF]">In minutes, not months.</span>
              </h2>
              <p className="text-[13px] font-semibold text-[#007AFF] mb-2 flex items-center gap-1.5">
                <Sparkles size={13} strokeWidth={2} />
                AI-powered digital collaboration hub for business growth
              </p>
              <p className="text-[14px] text-[#555] max-w-[460px] leading-[1.7]">
                Access 50+ verified products across 35 categories — with GCC-exclusive pricing, bundle deals, and AI-powered recommendations built in.
              </p>
            </div>
            <Link href="/software"
              className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[13px] font-semibold rounded-sm hover:bg-[#222] transition-colors shrink-0 min-h-[44px] whitespace-nowrap self-start sm:self-auto">
              Browse All Software <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>

          {/* ── Moving logo strip — actual provided logos + Clearbit fill ── */}
          <div className="mb-6 overflow-hidden border border-black/6 rounded-sm bg-white py-3.5">
            <div className="relative">
              {/* Fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, white, transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, white, transparent)' }} />

              {/* Scrolling track — 8 local logos × 4 repetitions for seamless loop */}
              <div className="flex items-center w-max" style={{ animation: 'marquee 32s linear infinite' }}>
                {(Array(4).fill([
                  { name: 'Zoho',         src: '/logos/zoho.avif'        },
                  { name: 'Dynamics 365', src: '/logos/dynamics365.avif' },
                  { name: 'Sprinklr',     src: '/logos/sprinklr.avif'    },
                  { name: 'Snowflake',    src: '/logos/snowflake.avif'   },
                  { name: 'Genesys',      src: '/logos/genesys.avif'     },
                  { name: 'Tally',        src: '/logos/tally.avif'       },
                  { name: 'Workleap',     src: '/logos/workleap.avif'    },
                  { name: 'Zimperium',    src: '/logos/zimperium.avif'   },
                ]).flat() as { name: string; src: string }[]).map((brand, i) => (
                  <div key={i} className="flex items-center shrink-0 px-8">
                    <img
                      src={brand.src}
                      alt={brand.name}
                      className="h-5 w-auto max-w-[90px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

          {/* 4 gateway tool cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
            {gatewayTools.map((tool, i) => (
              tool.external ? (
              <a key={tool.label} href={tool.href === 'COST_OPTIMIZER_URL' ? '#' : tool.href} target="_blank" rel="noopener noreferrer"
                className="relative border border-black/8 rounded-sm p-6 hover:border-black/20 hover:shadow-md transition-all group bg-white overflow-hidden cursor-pointer">
                {/* Subtle corner glow */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(circle, ${tool.color}20 0%, transparent 70%)` }} />
                <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-5 relative"
                  style={{ backgroundColor: tool.color + '12' }}>
                  <span style={{ color: tool.color }}>{tool.icon}</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center text-[8px] font-bold"
                    style={{ color: tool.color, borderColor: tool.color + '40' }}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2 leading-tight">{tool.label}</h3>
                <p className="text-[13px] text-[#555] leading-[1.65] mb-5">{tool.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors group-hover:gap-2"
                    style={{ color: tool.color }}>
                    Get started <ArrowRight size={12} />
                  </span>
                  <div className="w-7 h-7 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ borderColor: tool.color + '40', backgroundColor: tool.color + '10' }}>
                    <ArrowRight size={11} style={{ color: tool.color }} />
                  </div>
                </div>
              </a>
              ) : (
              <Link key={tool.label} href={tool.href}
                className="relative border border-black/8 rounded-sm p-6 hover:border-black/20 hover:shadow-md transition-all group bg-white overflow-hidden">
                {/* Subtle corner glow */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(circle, ${tool.color}20 0%, transparent 70%)` }} />

                <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-5 relative"
                  style={{ backgroundColor: tool.color + '12' }}>
                  <span style={{ color: tool.color }}>{tool.icon}</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center text-[8px] font-bold"
                    style={{ color: tool.color, borderColor: tool.color + '40' }}>
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-[16px] font-semibold text-black mb-2 leading-tight">{tool.label}</h3>
                <p className="text-[13px] text-[#555] leading-[1.65] mb-5">{tool.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors group-hover:gap-2"
                    style={{ color: tool.color }}>
                    Get started <ArrowRight size={12} />
                  </span>
                  <div className="w-7 h-7 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ borderColor: tool.color + '40', backgroundColor: tool.color + '10' }}>
                    <ArrowRight size={11} style={{ color: tool.color }} />
                  </div>
                </div>
              </Link>
              )
            ))}
          </div>

          {/* Stats strip below gateway */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { v: '50+', l: 'Verified products', c: '#007AFF' },
              { v: '35', l: 'Software categories', c: '#0051D5' },
              { v: 'Up to 40%', l: 'Bundle savings', c: '#007AFF' },
              { v: '7 days', l: 'Average activation', c: '#FF9500' },
            ].map(({ v, l, c }) => (
              <div key={l} className="border border-black/8 rounded-sm px-4 py-3.5 bg-white hover:border-black/16 transition-colors">
                <p className="text-[18px] font-semibold text-black leading-none mb-1" style={{ color: c }}>{v}</p>
                <p className="text-[11px] text-[#86868b]">{l}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-[#86868b] mt-5">
            Powered by <span className="font-semibold text-black">Zoftware</span> · Trusted by 5,000+ businesses across MENA & GCC
          </p>
        </div>
      </section>

      {/* ── IMPACT STATS ─────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] border-y border-black/6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-[#86868b] tracking-[0.12em] uppercase">Impact in 2025</p>
            <p className="text-[13px] text-[#555] mt-1 max-w-[680px]">
              Dubai Chamber of Commerce continued to make significant strides in advancing the interests of the business community — recording the largest annual increase in memberships in its history.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-white border border-black/8 rounded-sm px-4 py-4">
                <p className="text-[20px] sm:text-[24px] font-semibold text-black tracking-tight leading-none mb-1.5">{value}</p>
                <p className="text-[11px] text-[#86868b] leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold text-[#86868b] tracking-[0.1em] uppercase mb-1.5">Chamber Services</p>
            <h2 className="text-[22px] sm:text-[26px] font-semibold text-black tracking-tight">Explore Our Services</h2>
          </div>
          <a href="https://www.dubaichambers.com/en/web/dubai-chambers-1/services" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[12px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors min-h-[44px] items-center">
            View all services <ArrowRight size={12} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(svc => (
            <a key={svc.name} href={svc.href} target="_blank" rel="noopener noreferrer"
              className="border border-black/8 rounded-sm p-5 hover:border-black/20 hover:bg-[#f9fafb] transition-all group block">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-semibold text-black">{svc.name}</h3>
                <ExternalLink size={12} className="text-[#86868b] group-hover:text-black transition-colors shrink-0" />
              </div>
              <p className="text-[12px] text-[#555] leading-[1.65] mb-3">{svc.desc}</p>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors">
                Learn More <ChevronRight size={11} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── NEW HORIZONS + BUSINESS GROUPS ───────────────────────── */}
      <section className="bg-[#f5f5f7] border-y border-black/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-black/8 rounded-sm p-6 sm:p-8">
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Initiative</p>
              <h3 className="text-[20px] sm:text-[22px] font-semibold text-black tracking-tight mb-3">New Horizons</h3>
              <p className="text-[13px] text-[#555] leading-[1.7] mb-5">
                The New Horizons initiative supports Dubai Chamber of Commerce members in expanding their reach to prominent global markets. The initiative offers a range of interactive workshops and opportunities to participate in targeted trade missions to priority markets, allowing businesses to gain valuable insights, connect with key stakeholders, and explore opportunities for international growth.
              </p>
              <a href="https://www.dubaichambercommerce.com/en/new-horizons" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors min-h-[44px] items-center">
                Learn More <ArrowRight size={13} />
              </a>
            </div>
            <div className="bg-white border border-black/8 rounded-sm p-6 sm:p-8">
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Advocacy</p>
              <h3 className="text-[20px] sm:text-[22px] font-semibold text-black tracking-tight mb-3">Business Groups & Business Councils</h3>
              <p className="text-[13px] text-[#555] leading-[1.7] mb-4">
                Operating under the umbrella of Dubai Chamber of Commerce, sector-specific Business Groups and country-specific Business Councils serve as bridges between the business community and the government — driving effective advocacy, legislative enhancements, and improving Dubai&apos;s favourable business environment.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { title: 'Policy & Legislative Advocacy', desc: 'Supporting essential policy changes to create a more favourable business environment.' },
                  { title: 'Business Expansion', desc: 'Helping Dubai companies expand trade and investments abroad through bilateral relations.' },
                  { title: 'Governance & Transparency', desc: 'Enhancing governance practices and improving communication between stakeholders.' },
                  { title: 'Member Engagement', desc: 'Fostering collaboration and creating platforms for effective decision-making.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="border border-black/6 rounded-sm p-3 bg-[#f9fafb]">
                    <p className="text-[12px] font-semibold text-black mb-1">{title}</p>
                    <p className="text-[11px] text-[#86868b] leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
              <a href="https://www.dubaichambercommerce.com/en/business-groups-business-councils" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors min-h-[44px] items-center">
                Learn More <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DUBAI CENTRE FOR FAMILY BUSINESSES ───────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Centre</p>
            <h2 className="text-[22px] sm:text-[28px] font-semibold text-black tracking-tight mb-4">
              Dubai Centre for Family Businesses
            </h2>
            <p className="text-[14px] text-[#555] leading-[1.7] mb-5">
              The Dubai Centre for Family Businesses operates under the umbrella of Dubai Chambers to advance the interests of Dubai&apos;s family businesses ecosystem. The centre works closely with key public and private sector stakeholders to support the sustainable success of family businesses, leveraging strategic partnerships to shape innovative solutions that drive the sector&apos;s growth.
            </p>
            <a href="https://www.dubaichambercommerce.com/en/dubai-centre-for-family-businesses" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#007AFF] text-white px-5 py-2.5 text-[13px] font-semibold rounded-sm hover:bg-[#0051D5] transition-colors min-h-[40px]">
              Learn More <ArrowRight size={13} />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '🤝', title: 'Strategic Partnerships', desc: 'Leveraging partnerships to address market challenges and create innovative solutions.' },
              { icon: '📈', title: 'Sustainable Growth', desc: 'Supporting long-term success and business continuity across generations.' },
              { icon: '🏛️', title: 'Stakeholder Engagement', desc: 'Close collaboration with public and private sector to shape policy and best practice.' },
              { icon: '💡', title: 'Sector Innovation', desc: 'Driving innovation and transformation in Dubai\'s family business ecosystem.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="border border-black/8 rounded-sm p-4 hover:border-[#007AFF]/20 hover:bg-[#f8fbff] transition-all">
                <p className="text-[20px] mb-2">{icon}</p>
                <p className="text-[13px] font-semibold text-black mb-1">{title}</p>
                <p className="text-[12px] text-[#86868b] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CENTRE FOR RESPONSIBLE BUSINESS ──────────────────────── */}
      <section className="bg-[#f5f5f7] border-y border-black/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Sustainability</p>
              <h2 className="text-[22px] sm:text-[28px] font-semibold text-black tracking-tight mb-4">
                Centre for Responsible Business
              </h2>
              <p className="text-[14px] text-[#555] leading-[1.7] mb-5">
                Established in 2004, the Centre for Responsible Business (CRB) leads the way in promoting Corporate Social Responsibility (CSR) and sustainable business practices. The CRB provides platforms, knowledge, and tools to help businesses embed CSR and sustainability throughout their operations, enhancing performance and unlocking competitive advantages.
              </p>
              <a href="https://www.dubaichambercommerce.com/en/centre-for-responsible-business" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#007AFF] text-white px-5 py-2.5 text-[13px] font-semibold rounded-sm hover:bg-[#0051D5] transition-colors min-h-[40px]">
                Learn More <ArrowRight size={13} />
              </a>
            </div>
            <div className="space-y-3">
              <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-4">The CRB can help you:</p>
              {[
                'Gain recognition and awards for your commitment to CSR and sustainability.',
                'Connect with like-minded businesses to share best practices and collaborate on sustainability initiatives.',
                'Receive expert guidance and support to implement responsible business practices and improve CSR performance.',
                'Access valuable resources, tools, and guides to embed CSR and sustainability throughout your business operations.',
                'Benefit from professional evaluations and feedback to enhance your company\'s CSR efforts.',
                'Integrate CSR, sustainability, and good governance into your management and operational processes.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-black/8 rounded-sm px-4 py-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#007AFF]">{i + 1}</span>
                  </div>
                  <p className="text-[13px] text-[#555] leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SMART APP ────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Mobile</p>
            <h2 className="text-[22px] sm:text-[28px] font-semibold text-black tracking-tight mb-4">
              Smart App For a<br />Smarter Business Future
            </h2>
            <p className="text-[14px] text-[#555] leading-[1.7] mb-6">
              The Dubai Chambers App delivers a seamless, intelligent platform that transforms how businesses access essential services. With streamlined journeys and integrated features, it offers a smooth digital experience for entrepreneurs, exporters, and companies of all sizes.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Membership Management', 'Document Attestation', 'Attestation Services', 'Application Tracking'].map(feat => (
                <span key={feat} className="flex items-center gap-1.5 text-[12px] font-medium text-[#007AFF] bg-[#eff6ff] border border-[#007AFF]/15 px-3 py-1.5 rounded-sm">
                  <Check size={11} strokeWidth={2.5} /> {feat}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a href="https://apps.apple.com/ae/app/dubai-chambers/id1200034988" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black text-white px-4 py-2.5 text-[13px] font-semibold rounded-sm hover:bg-[#333] transition-colors">
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.ae.dubaichamber" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-black/15 text-black px-4 py-2.5 text-[13px] font-semibold rounded-sm hover:bg-[#f5f5f7] transition-colors">
                Google Play
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '⚡', title: 'Effortless Access', desc: 'Instant access to all Dubai Chamber services from your mobile device.' },
              { icon: '📋', title: 'Streamlined Journeys', desc: 'Integrated features designed for entrepreneurs, exporters, and enterprises.' },
              { icon: '🔒', title: 'Trusted Gateway', desc: 'Designed with clarity and precision — your gateway to doing business in Dubai.' },
              { icon: '📱', title: 'Smart Experience', desc: 'Intelligent platform that transforms how businesses interact with the chamber.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="border border-black/8 rounded-sm p-4 hover:border-[#007AFF]/20 hover:bg-[#f8fbff] transition-all">
                <p className="text-[24px] mb-2">{icon}</p>
                <p className="text-[13px] font-semibold text-black mb-1">{title}</p>
                <p className="text-[12px] text-[#86868b] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS ─────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold text-[#86868b] tracking-[0.1em] uppercase mb-1.5">Latest</p>
            <h2 className="text-[22px] sm:text-[26px] font-semibold text-black tracking-tight">News</h2>
          </div>
          <a href="https://www.dubaichambercommerce.com/en/news" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[12px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors min-h-[44px] items-center">
            View all articles <ArrowRight size={12} />
          </a>
        </div>
        <div className="space-y-4">
          <a href={news[0].href} target="_blank" rel="noopener noreferrer"
            className="block border border-black/8 rounded-sm p-5 sm:p-6 hover:border-black/20 hover:bg-[#f9fafb] transition-all group">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-[10px] font-semibold text-white bg-[#007AFF] px-2 py-0.5 rounded-sm shrink-0">Featured</span>
              <span className="text-[11px] text-[#86868b]">{news[0].date}</span>
            </div>
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-black group-hover:text-[#007AFF] transition-colors">{news[0].title}</h3>
            <span className="inline-flex items-center gap-1 mt-3 text-[12px] font-semibold text-[#007AFF]">
              Read More <ChevronRight size={11} />
            </span>
          </a>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {news.slice(1).map(n => (
              <a key={n.title} href={n.href} target="_blank" rel="noopener noreferrer"
                className="border border-black/8 rounded-sm p-4 hover:border-black/20 hover:bg-[#f9fafb] transition-all group block">
                <p className="text-[11px] text-[#86868b] mb-2">{n.date}</p>
                <h3 className="text-[13px] font-medium text-black leading-snug group-hover:text-[#007AFF] transition-colors line-clamp-3">{n.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNATIONAL PRESENCE ──────────────────────────────── */}
      <section className="bg-[#f8faff] border-y border-black/6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Global Reach</p>
              <h2 className="text-[22px] sm:text-[28px] font-semibold text-black tracking-tight mb-4">
                Connecting Dubai Businesses to the World
              </h2>
              <p className="text-[14px] text-[#555] leading-[1.7] mb-5">
                Through trade missions, bilateral business meetings, and partnerships with chambers of commerce across 30+ countries, Dubai Chamber helps members unlock new markets and forge lasting international relationships.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { v: '510', l: 'B2B meetings in Addis Ababa 2025' },
                  { v: '276', l: 'Bilateral meetings in Accra' },
                  { v: '30+', l: 'Countries in trade mission network' },
                ].map(({ v, l }) => (
                  <div key={l} className="border border-black/8 rounded-sm p-3 bg-white text-center">
                    <p className="text-[22px] font-semibold text-[#007AFF] leading-none mb-1">{v}</p>
                    <p className="text-[10px] text-[#86868b] leading-snug">{l}</p>
                  </div>
                ))}
              </div>
              <a href="https://www.dubaichambercommerce.com/en/new-horizons" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#007AFF] text-white px-5 py-2.5 text-[13px] font-semibold rounded-sm hover:bg-[#0051D5] transition-colors min-h-[40px]">
                Explore New Horizons <ArrowRight size={13} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { country: 'Ethiopia', meetings: '510 B2B meetings', tag: 'Record 2025' },
                { country: 'Ghana', meetings: '276 bilateral meetings', tag: 'Trade Mission' },
                { country: 'India', meetings: 'Strategic partnership', tag: 'Priority Market' },
                { country: 'China', meetings: 'Annual business forum', tag: 'Key Partner' },
                { country: 'UK', meetings: 'Financial services focus', tag: 'G7' },
                { country: 'Germany', meetings: 'Industrial cooperation', tag: 'EU Hub' },
              ].map(({ country, meetings, tag }) => (
                <div key={country} className="border border-black/8 rounded-sm p-3.5 bg-white hover:border-[#007AFF]/20 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-semibold text-black">{country}</p>
                    <span className="text-[9px] font-bold text-[#007AFF] bg-[#007AFF]/8 px-1.5 py-0.5 rounded-sm">{tag}</span>
                  </div>
                  <p className="text-[11px] text-[#86868b]">{meetings}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ──────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold text-[#86868b] tracking-[0.1em] uppercase mb-1.5">Calendar</p>
            <h2 className="text-[22px] sm:text-[26px] font-semibold text-black tracking-tight">Upcoming Events</h2>
          </div>
          <a href="https://www.dubaichambers.com/en/events" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[12px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors">
            View all events <ArrowRight size={12} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { date: 'Jul 14, 2026', title: 'Annual Business Awards Ceremony', category: 'Awards', href: 'https://www.dubaichambers.com/en/events', featured: true },
            { date: 'Jul 22, 2026', title: 'Trade Mission to Southeast Asia — Singapore & Indonesia', category: 'Trade Mission', href: 'https://www.dubaichambers.com/en/events' },
            { date: 'Aug 5, 2026', title: 'Digital Transformation Forum for SMEs', category: 'Forum', href: 'https://www.dubaichambers.com/en/events' },
            { date: 'Aug 18, 2026', title: 'Sustainability & ESG Reporting Workshop', category: 'Workshop', href: 'https://www.dubaichambers.com/en/events' },
            { date: 'Sep 3, 2026', title: 'Family Business Leadership Summit 2026', category: 'Summit', href: 'https://www.dubaichambers.com/en/events' },
            { date: 'Sep 21, 2026', title: 'GITEX Global — Dubai Chamber Business Pavilion', category: 'Exhibition', href: 'https://www.dubaichambers.com/en/events' },
          ].map(ev => (
            <a key={ev.title} href={ev.href} target="_blank" rel="noopener noreferrer"
              className="border border-black/8 rounded-sm p-4 hover:border-black/20 hover:bg-[#f9fafb] transition-all group block">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm ${
                  ev.featured ? 'bg-[#007AFF] text-white' : 'bg-[#f5f5f7] text-[#86868b]'
                }`}>{ev.category}</span>
                <span className="text-[10px] text-[#86868b]">{ev.date}</span>
              </div>
              <h3 className="text-[13px] font-semibold text-black group-hover:text-[#007AFF] transition-colors leading-snug">{ev.title}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* ── RESPONSIBLE BUSINESS + CTA BANNER ───────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Responsible Business */}
          <div className="lg:col-span-2 border border-black/8 rounded-sm p-6 sm:p-8 bg-[#f8faff]">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Sustainability</p>
            <h3 className="text-[20px] sm:text-[22px] font-semibold text-black tracking-tight mb-3">Centre for Responsible Business</h3>
            <p className="text-[13px] text-[#555] leading-[1.7] mb-5">
              The Centre for Responsible Business promotes ESG practices, sustainable supply chains, and ethical governance across Dubai&apos;s private sector. Helping members align with UAE Net Zero 2050 and global sustainability standards.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {['Net Zero 2050', 'ESG Reporting', 'Green Supply Chain', 'Circular Economy', 'Social Impact'].map(tag => (
                <span key={tag} className="text-[11px] font-medium px-2.5 py-1 border border-[#007AFF]/20 text-[#007AFF] bg-[#007AFF]/5 rounded-sm">{tag}</span>
              ))}
            </div>
            <a href="https://www.dubaichambercommerce.com/en/centre-for-responsible-business" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors">
              Learn More <ArrowRight size={13} />
            </a>
          </div>

          {/* Quick CTA */}
          <div className="border border-black/8 rounded-sm p-6 bg-black flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#007AFF] mb-3">Member Benefits</p>
              <h3 className="text-[18px] font-semibold text-white mb-3">Join 292,000+ member companies</h3>
              <p className="text-[12px] text-white/60 leading-relaxed mb-5">
                Access exclusive benefits, networking events, and government relations support as a Dubai Chamber member.
              </p>
            </div>
            <div className="space-y-2">
              <a href="https://www.dubaichambers.com/new-membership" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#007AFF] text-white py-2.5 text-[13px] font-semibold rounded-sm hover:bg-[#0051D5] transition-colors">
                Apply for Membership <ArrowRight size={13} />
              </a>
              <a href="https://www.dubaichambers.com/services" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-white/15 text-white/80 py-2.5 text-[13px] font-medium rounded-sm hover:bg-white/8 transition-colors">
                View All Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-black/8 bg-[#f9fafb]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-[2px]">
                    {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]" />)}
                  </div>
                </div>
                <span className="text-[14px] font-bold text-black tracking-tight">LOGO</span>
              </div>
              <p className="text-[12px] text-[#86868b] leading-[1.6] mb-3">
                Shaping Dubai&apos;s business landscape since 1965.
              </p>
              <a href="tel:8002426237" className="flex items-center gap-1.5 text-[12px] text-[#555] hover:text-black mb-1">
                <Phone size={11} /> 800 242 6237 (Toll-free)
              </a>
              <a href="tel:+97142280000" className="flex items-center gap-1.5 text-[12px] text-[#555] hover:text-black">
                <Phone size={11} /> (+971) 4 228 0000
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.07em] mb-3">Business Hub</p>
              {[
                { l: 'Become a Member', h: 'https://www.dubaichambers.com/new-membership' },
                { l: 'Business Groups', h: 'https://www.dubaichambercommerce.com/en/business-groups-business-councils' },
                { l: 'Centre for Responsible Business', h: 'https://www.dubaichambercommerce.com/en/centre-for-responsible-business' },
              ].map(({ l, h }) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  className="block text-[12px] text-black hover:text-[#007AFF] transition-colors mb-2">{l}</a>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.07em] mb-3">Knowledge Centre</p>
              {[
                { l: 'Resource Toolkit', h: 'https://www.dubaichambers.com/resources' },
                { l: 'Commercial Directory', h: 'https://dcdigitalservices.dubaichamber.com/' },
                { l: 'Events', h: 'https://www.dubaichambers.com/en/events' },
              ].map(({ l, h }) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  className="block text-[12px] text-black hover:text-[#007AFF] transition-colors mb-2">{l}</a>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.07em] mb-3">Quick Links</p>
              {[
                { l: 'Family Businesses', h: 'https://www.dubaichambercommerce.com/en/dubai-centre-for-family-businesses' },
                { l: 'Careers', h: 'https://careers.dubaichambers.com/' },
                { l: 'Contact Us', h: 'https://www.dubaichambers.com/en/contact-us' },
              ].map(({ l, h }) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  className="block text-[12px] text-black hover:text-[#007AFF] transition-colors mb-2">{l}</a>
              ))}
              <Link href="/software"
                className="flex items-center gap-1 text-[12px] font-semibold text-[#007AFF] hover:text-[#0051D5] transition-colors mt-1">
                <Package size={11} /> Software Gateway
              </Link>
            </div>
          </div>
          <div className="border-t border-black/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[#86868b]">© 2026 Dubai Chambers. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.dubaichambers.com/security-and-privacy-policy" target="_blank" rel="noopener noreferrer"
                className="text-[11px] text-[#86868b] hover:text-black">Security & Privacy Policy</a>
              <a href="https://www.dubaichambers.com/terms-and-conditions" target="_blank" rel="noopener noreferrer"
                className="text-[11px] text-[#86868b] hover:text-black">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
