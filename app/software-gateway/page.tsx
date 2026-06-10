'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, FileText, BarChart2, TrendingDown, ArrowRight, Zap,
  Phone, X, Send, Sparkles, ChevronRight,
  ExternalLink, PhoneOff, Check, Star, SlidersHorizontal
} from 'lucide-react';
import { gatewayProducts } from '@/data/gateway-products';
import ThemeToggle from '@/components/ThemeToggle';

// ── Tool cards ────────────────────────────────────────────────────────────────
const tools = [
  {
    icon: <Search size={20} strokeWidth={1.5} />,
    label: 'Smart Search',
    desc: 'Find the right software from 50+ verified products in seconds.',
    href: null,           // opens SmartSearch modal instead of navigating
    color: 'var(--color-accent)',
    badge: 'Instant results',
    external: false,
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    label: 'Tech Strategy Builder',
    desc: 'Get a full tech strategy and implementation roadmap in under 1 minute.',
    href: '/software/report/strategy',
    color: '#7C3AED',
    badge: 'AI-generated',
    external: false,
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    label: 'Tech Requirement Builder',
    desc: 'Generate a detailed technical requirements document for your procurement.',
    href: '/software/report/requirements',
    color: '#0284C7',
    badge: 'RFP-ready',
    external: false,
  },
  {
    icon: <TrendingDown size={20} strokeWidth={1.5} />,
    label: 'Cost Optimizer',
    desc: 'Analyse your current software spend and uncover savings opportunities instantly.',
    href: 'https://enterprise-level-redesign.vercel.app?autoauth=zv2',
    color: '#16A34A',
    badge: 'Save up to 40%',
    external: true,
  },
];

const logos = [
  { name: 'Zoho',         src: '/logos/zoho.avif'        },
  { name: 'Dynamics 365', src: '/logos/dynamics365.avif' },
  { name: 'Sprinklr',     src: '/logos/sprinklr.avif'    },
  { name: 'Snowflake',    src: '/logos/snowflake.avif'   },
  { name: 'Genesys',      src: '/logos/genesys.avif'     },
  { name: 'Tally',        src: '/logos/tally.avif'       },
  { name: 'Workleap',     src: '/logos/workleap.avif'    },
  { name: 'Zimperium',    src: '/logos/zimperium.avif'   },
];

// ── Compatibility score ───────────────────────────────────────────────────────
function getScore(p: typeof gatewayProducts[0], q: string): number {
  if (!q.trim()) return Math.round(60 + p.rating * 6);
  const ql = q.toLowerCase();
  let s = 52;
  if (p.name.toLowerCase().includes(ql))     s += 28;
  if (p.category.toLowerCase().includes(ql)) s += 20;
  if (p.vendor.toLowerCase().includes(ql))   s += 14;
  if (p.tagline.toLowerCase().includes(ql))  s += 10;
  p.tags.forEach(t => { if (t.toLowerCase().includes(ql)) s += 5; });
  return Math.min(97, s);
}

// ── Smart Search constants ────────────────────────────────────────────────────
const SS_BUDGETS = [
  { id: 'b1', label: '$0–500/mo',       min: 0,    max: 500   },
  { id: 'b2', label: '$500–1,000/mo',   min: 500,  max: 1000  },
  { id: 'b3', label: '$1,000–5,000/mo', min: 1000, max: 5000  },
  { id: 'b4', label: 'Custom',          min: 0,    max: 999999 },
];
const SS_SIZES = ['< 100', '100–1,000', '1,000–10,000', '10,000+'];
const SS_SIZE_MAP: Record<string, string[]> = {
  '< 100':        ['SME'],
  '100–1,000':    ['SME', 'Mid-Market'],
  '1,000–10,000': ['Mid-Market', 'Enterprise'],
  '10,000+':      ['Enterprise'],
};
const SS_SUPPORTS: Record<string, string> = {
  'Cloud':      'Web · iOS · Android',
  'On-Premise': 'Windows · Linux · Web',
  'Hybrid':     'Web · Windows · iOS · Android',
};

// ── Smart Search Modal (3-step flow) ─────────────────────────────────────────
function SmartSearchModal({ onClose }: { onClose: () => void }) {
  const [step,        setStep]        = useState<1|2|3>(1);
  const [query,       setQuery]       = useState('');
  const [budget,      setBudget]      = useState<string | null>(null);
  const [companySize, setCompanySize] = useState<string | null>(null);
  const [industry,    setIndustry]    = useState('');
  const [selected,    setSelected]    = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (step === 1) inputRef.current?.focus(); }, [step]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const results = useMemo(() => {
    const q = [query, industry].filter(Boolean).join(' ').toLowerCase().trim();
    let prods = gatewayProducts
      .map(p => ({ ...p, score: getScore(p, q) }))
      .filter(p => !q || p.score > 58);
    if (budget && budget !== 'b4') {
      const r = SS_BUDGETS.find(b => b.id === budget);
      if (r) prods = prods.filter(p => p.gcPrice >= r.min && p.gcPrice <= r.max);
    }
    if (companySize) {
      const allowed = SS_SIZE_MAP[companySize] || [];
      prods = prods.filter(p => p.targetSize.some(s => allowed.includes(s)));
    }
    return prods.sort((a, b) => b.score - a.score).slice(0, 12);
  }, [query, industry, budget, companySize]);

  const compareList = useMemo(
    () => results.filter(p => selected.includes(p.id)),
    [results, selected]
  );

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const scoreColor = (s: number) =>
    s >= 85 ? '#16A34A' : s >= 70 ? '#D97706' : '#6366F1';

  const modalCls = `bg-white w-full flex flex-col shadow-2xl border border-black/8 overflow-hidden sm:rounded-2xl`;

  const closeBtn = (
    <button onClick={onClose}
      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-black hover:bg-surface transition-colors shrink-0">
      <X size={15} />
    </button>
  );

  // ── STEP 1: Search + Filters ──────────────────────────────────────────────
  if (step === 1) return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className={modalCls}
        style={{ maxWidth: '600px', maxHeight: 'min(92vh, 760px)', height: '100%' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-black/8 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            <Search size={16} className="text-white" strokeWidth={2} />
          </div>
          <p className="text-[15px] font-semibold text-black flex-1">Smart Search</p>
          {closeBtn}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <h2 className="text-[24px] font-semibold text-black leading-tight mb-1.5">
            What are you looking for?
          </h2>
          <p className="text-[13px] text-muted mb-6 leading-[1.6]">
            Describe your needs and we'll match you with the right software from 50+ verified products.
          </p>

          <div className="relative mb-7">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setStep(2); }}
              placeholder="e.g. CRM for a 50-person team, ERP for retail…"
              className="w-full pl-11 pr-4 py-3.5 text-[14px] border border-black/12 rounded-xl outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-[#fafafa] focus:bg-white transition-all"
            />
          </div>

          <p className="text-[10px] font-bold text-black uppercase tracking-[0.1em] mb-4">Quick Filters</p>

          <div className="mb-5">
            <p className="text-[12px] font-semibold text-[#444] mb-2.5">Budget</p>
            <div className="flex flex-wrap gap-2">
              {SS_BUDGETS.map(b => (
                <button key={b.id} onClick={() => setBudget(budget === b.id ? null : b.id)}
                  className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                    budget === b.id
                      ? 'bg-black text-white border-black'
                      : 'border-black/15 text-[#555] hover:border-black/30 hover:bg-black/4'
                  }`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-[12px] font-semibold text-[#444] mb-2.5">Company Size</p>
            <div className="flex flex-wrap gap-2">
              {SS_SIZES.map(s => (
                <button key={s} onClick={() => setCompanySize(companySize === s ? null : s)}
                  className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                    companySize === s
                      ? 'bg-black text-white border-black'
                      : 'border-black/15 text-[#555] hover:border-black/30 hover:bg-black/4'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] font-semibold text-[#444] mb-2.5">
              Industry <span className="text-muted font-normal text-[11px]">(optional)</span>
            </p>
            <input value={industry} onChange={e => setIndustry(e.target.value)}
              placeholder="e.g. Healthcare, Finance, Retail, Manufacturing…"
              className="w-full px-4 py-2.5 text-[13px] border border-black/12 rounded-xl outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-[#fafafa] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-black/8 px-6 py-4 flex items-center justify-between shrink-0">
          <button onClick={() => setStep(2)}
            className="text-[13px] text-muted hover:text-black transition-colors">
            Skip filters →
          </button>
          <button onClick={() => setStep(2)}
            className="flex items-center gap-2 text-[13px] font-semibold text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            <Search size={14} strokeWidth={2} /> Search
          </button>
        </div>
      </div>
    </div>
  );

  // ── STEP 2: Results ───────────────────────────────────────────────────────
  if (step === 2) return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className={modalCls}
        style={{ maxWidth: '1020px', maxHeight: 'min(92vh, 840px)', height: '100%' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-black/8 shrink-0">
          <button onClick={() => { setStep(1); setSelected([]); }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[18px] leading-none text-muted hover:text-black hover:bg-surface transition-colors shrink-0">
            ←
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-black truncate">
              {query ? `Your results for "${query}"` : 'All Products'}
            </p>
            <p className="text-[11px] text-muted">{results.length} matches found</p>
          </div>
          <button
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-accent border border-accent/30 hover:bg-accent hover:text-white px-3.5 py-1.5 rounded-xl shrink-0 transition-all">
            Build RFP with matches →
          </button>
          {selected.length >= 2 && (
            <button onClick={() => setStep(3)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3.5 py-1.5 rounded-xl shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
              <SlidersHorizontal size={11} /> Compare ({selected.length})
            </button>
          )}
          {closeBtn}
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Results grid */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[15px] font-semibold text-black mb-2">No products match your criteria</p>
                <p className="text-[12px] text-muted mb-4">Try adjusting your filters or broadening your search.</p>
                <button onClick={() => setStep(1)}
                  className="text-[12px] font-semibold text-accent hover:underline">
                  ← Adjust filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map(p => {
                  const sc = p.score;
                  const col = scoreColor(sc);
                  const isSel = selected.includes(p.id);
                  return (
                    <div key={p.id}
                      className={`relative rounded-xl border p-4 transition-all ${
                        isSel
                          ? 'border-accent/40 bg-accent/3 shadow-sm shadow-accent/8'
                          : 'border-black/8 bg-white hover:border-black/20 hover:shadow-md'
                      }`}>
                      {/* Match badge */}
                      <div className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: col + '18', color: col }}>
                        {sc}% match
                      </div>
                      {/* Product info */}
                      <div className="flex items-start gap-3 mb-2.5 pr-20">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[11px] font-bold text-zinc-600 shrink-0">
                          {p.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-black leading-tight">{p.name}</p>
                          <p className="text-[10px] text-muted">{p.vendor} · {p.category}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#555] leading-snug mb-3 line-clamp-2">{p.tagline}</p>
                      {/* Rating + Price */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={9}
                              fill={i <= Math.round(p.rating) ? '#F59E0B' : 'none'}
                              className={i <= Math.round(p.rating) ? 'text-amber-400' : 'text-zinc-300'} />
                          ))}
                          <span className="text-[9px] text-muted ml-0.5">{p.rating}</span>
                        </div>
                        <span className="text-[12px] font-bold text-black">
                          {p.gcPrice === 0 ? 'Free' : `$${p.gcPrice}/mo`}
                        </span>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleSelect(p.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold py-1.5 rounded-lg border transition-all ${
                            isSel
                              ? 'border-accent/50 text-accent bg-accent/8'
                              : 'border-black/12 text-[#555] hover:border-black/25 hover:bg-black/4'
                          }`}>
                          {isSel ? <><Check size={10} /> Added</> : <><SlidersHorizontal size={10} /> Compare</>}
                        </button>
                        <Link href={`/software/product/${p.slug}`}
                          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold py-1.5 rounded-lg border border-accent/30 text-accent hover:bg-accent hover:text-white hover:border-accent transition-all"
                          onClick={onClose}>
                          View Details <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="hidden md:flex w-[220px] shrink-0 border-l border-black/8 overflow-y-auto flex-col gap-3 px-4 py-4">
            <div className="rounded-xl border border-black/8 p-4 bg-[#fafafa]">
              <p className="text-[12px] font-bold text-black mb-3">Refine your match</p>
              <ul className="space-y-2 mb-4">
                {['See precise fit %', 'Get accurate pricing estimates', 'Auto-draft your RFP document'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-[#444] leading-snug">
                    <Check size={10} className="text-green-500 mt-0.5 shrink-0" strokeWidth={3} /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/software/report/requirements"
                className="flex items-center justify-center text-[11px] font-semibold text-white w-full py-2 rounded-lg"
                style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}
                onClick={onClose}>
                Start RFP Builder →
              </Link>
            </div>

            <div className="rounded-xl border border-black/8 p-4 bg-[#fafafa]">
              <p className="text-[12px] font-bold text-black mb-1">Continue evaluation</p>
              <p className="text-[10px] text-muted mb-3 leading-[1.5]">
                Expert advice tailored to your industry and budget.
              </p>
              <button
                className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-accent border border-accent/30 w-full py-2 rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all">
                <Phone size={11} /> Talk to an Advisor
              </button>
            </div>

            {selected.length > 0 && (
              <div className="rounded-xl border border-accent/25 p-4 bg-accent/4">
                <p className="text-[11px] font-bold text-accent mb-2">
                  {selected.length} selected for compare
                </p>
                <button onClick={() => setStep(3)} disabled={selected.length < 2}
                  className="w-full text-[11px] font-semibold text-white py-2 rounded-lg disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                  Compare Now →
                </button>
                <button onClick={() => setSelected([])}
                  className="w-full text-[10px] text-muted hover:text-black mt-1.5 text-center">
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── STEP 3: Compare table ─────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className={modalCls}
        style={{ maxWidth: '1100px', maxHeight: 'min(92vh, 840px)', height: '100%' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-black/8 shrink-0">
          <button onClick={() => setStep(2)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[18px] leading-none text-muted hover:text-black hover:bg-surface transition-colors shrink-0">
            ←
          </button>
          <p className="text-[15px] font-semibold text-black flex-1">
            Comparing {compareList.length} product{compareList.length !== 1 ? 's' : ''}
          </p>
          {closeBtn}
        </div>

        {/* Compare table */}
        <div className="flex-1 overflow-auto">
          <table className="border-collapse"
            style={{ minWidth: `${160 + compareList.length * 240}px`, width: '100%' }}>
            <thead>
              <tr>
                <th className="sticky left-0 bg-white z-10 border-b border-r border-black/8 p-4 w-[160px] min-w-[160px]" />
                {compareList.map(p => (
                  <th key={p.id}
                    className="border-b border-r last:border-r-0 border-black/8 p-5 text-left min-w-[220px] align-top">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[11px] font-bold text-zinc-600 mb-2.5">
                      {p.logo}
                    </div>
                    <p className="text-[13px] font-semibold text-black leading-tight">{p.name}</p>
                    <p className="text-[10px] text-muted mt-0.5 mb-2">{p.vendor}</p>
                    <Link href={`/software/product/${p.slug}`}
                      className="text-[11px] font-semibold text-accent hover:underline"
                      onClick={onClose}>
                      Visit Profile →
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Pricing */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Pricing starting from</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <p className="text-[14px] font-bold text-black">{p.gcPrice === 0 ? 'Free' : `$${p.gcPrice}/mo`}</p>
                    {p.discountPct > 0 && (
                      <p className="text-[10px] text-green-600 font-semibold mt-0.5">{p.discountPct}% GCC discount</p>
                    )}
                  </td>
                ))}
              </tr>
              {/* Rating */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Rating</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <div className="flex items-center gap-1 mb-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={11}
                          fill={i <= Math.round(p.rating) ? '#F59E0B' : 'none'}
                          className={i <= Math.round(p.rating) ? 'text-amber-400' : 'text-zinc-300'} />
                      ))}
                      <span className="text-[12px] font-bold text-black ml-0.5">{p.rating}</span>
                    </div>
                    <p className="text-[10px] text-muted">{p.reviews.toLocaleString()} reviews</p>
                  </td>
                ))}
              </tr>
              {/* Overview */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Overview</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <p className="text-[11px] text-[#444] leading-[1.65]">{p.tagline}</p>
                  </td>
                ))}
              </tr>
              {/* Best for */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Best for</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <div className="flex flex-wrap gap-1">
                      {p.targetSize.map(s => (
                        <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/6 text-[#444]">{s}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              {/* Competitive Advantage */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Competitive Advantage</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <p className="text-[11px] text-[#444] leading-[1.65]">{p.usp || p.tagline}</p>
                  </td>
                ))}
              </tr>
              {/* Features */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Features</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 6).map(t => (
                        <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-surface text-[#555] border border-black/8">{t}</span>
                      ))}
                      {p.tags.length > 6 && (
                        <span className="text-[9px] text-muted self-center">+{p.tags.length - 6} more</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              {/* Deployment */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Deployment</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/6 text-[#333]">{p.deployment}</span>
                  </td>
                ))}
              </tr>
              {/* Integrations */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Integrations</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <div className="flex flex-wrap gap-1">
                      {p.integrations.slice(0, 5).map(intg => (
                        <span key={intg} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{intg}</span>
                      ))}
                      {p.integrations.length > 5 && (
                        <span className="text-[9px] text-muted self-center">+{p.integrations.length - 5} more</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              {/* Supports */}
              <tr className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-[#333]">Supports</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <p className="text-[11px] text-[#444]">{SS_SUPPORTS[p.deployment] || 'Web · iOS · Android'}</p>
                  </td>
                ))}
              </tr>
              {/* Contact Us */}
              <tr>
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8" />
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    <Link href={`/software/product/${p.slug}`}
                      className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-white w-full py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}
                      onClick={onClose}>
                      Contact Us <ArrowRight size={11} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Chatbot types ─────────────────────────────────────────────────────────────
type Message = {
  role: 'assistant' | 'user';
  text: string;
  products?: typeof gatewayProducts;
  toolLink?: { label: string; href: string; external?: boolean };
};

const GREETING: Message = {
  role: 'assistant',
  text: "Hi! I'm Zain, your Software Gateway assistant. I can help you find the right software, build a requirements doc, or create a tech strategy.\n\nWhat are you looking for?",
};

function searchProducts(query: string) {
  const q = query.toLowerCase();
  return gatewayProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.vendor.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4);
}

// ── Browser-based voice caller ────────────────────────────────────────────────
function BrowserCaller({ onClose }: { onClose: () => void }) {
  const [callState, setCallState] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [duration,  setDuration]  = useState(0);
  const [bars,      setBars]      = useState<number[]>(Array(20).fill(4));
  const streamRef  = useRef<MediaStream | null>(null);
  const animRef    = useRef<number | null>(null);

  const stopAll = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const simulate = () => {
      setBars(Array(20).fill(0).map(() => Math.random() * 28 + 3));
      animRef.current = requestAnimationFrame(simulate);
    };
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const an  = ctx.createAnalyser();
        an.fftSize = 64;
        src.connect(an);
        const data = new Uint8Array(an.frequencyBinCount);
        const draw = () => {
          an.getByteFrequencyData(data);
          setBars(Array.from(data.slice(0, 20)).map(v => Math.max(3, (v / 255) * 34)));
          animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        setTimeout(() => setCallState('active'), 1800);
      })
      .catch(() => {
        setTimeout(() => setCallState('active'), 1800);
        animRef.current = requestAnimationFrame(simulate);
      });
    return stopAll;
  }, [stopAll]);

  useEffect(() => {
    if (callState !== 'active') return;
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const hangUp = () => { stopAll(); setCallState('ended'); setTimeout(onClose, 1200); };

  const ringColor = callState === 'active' ? '#34D399' : callState === 'connecting' ? '#FCD34D' : '#F87171';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#0c0c1a] rounded-2xl px-8 py-10 w-full max-w-[300px] text-center shadow-2xl border border-white/8">
        {/* Zain avatar + ring animation */}
        <div className="relative inline-flex items-center justify-center mb-5">
          {callState !== 'ended' && (
            <>
              <div className="absolute w-20 h-20 rounded-full border-2 animate-ping"
                style={{ borderColor: ringColor + '50' }} />
              <div className="absolute w-26 h-26 rounded-full border animate-ping"
                style={{ borderColor: ringColor + '25', animationDelay: '0.5s', width: '6.5rem', height: '6.5rem' }} />
            </>
          )}
          <img src="/zain-avatar.svg" alt="Zain" className="w-16 h-16 rounded-full relative z-10" />
        </div>

        <p className="text-white font-semibold text-[16px] mb-0.5">Zain</p>
        <p className="text-white/40 text-[11px] mb-3">Software Gateway · Voice Agent</p>
        <p className="text-[12px] font-semibold mb-7" style={{ color: ringColor }}>
          {callState === 'connecting' ? 'Connecting…'
         : callState === 'active'     ? `Connected · ${fmt(duration)}`
         : 'Call ended'}
        </p>

        {/* Waveform */}
        <div className="flex items-end justify-center gap-[3px] mb-8 h-9">
          {bars.map((h, i) => (
            <div key={i} className="rounded-full transition-all duration-75" style={{
              width: '3px',
              height: callState === 'active' ? `${h}px` : '3px',
              backgroundColor: ringColor,
              opacity: callState === 'active' ? 0.5 + (h / 34) * 0.5 : 0.25,
            }} />
          ))}
        </div>

        {callState !== 'ended' ? (
          <button onClick={hangUp}
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-colors shadow-lg"
            style={{ backgroundColor: '#EF4444', boxShadow: '0 4px 20px rgba(239,68,68,0.35)' }}>
            <PhoneOff size={20} className="text-white" />
          </button>
        ) : (
          <p className="text-white/30 text-[12px]">Closing…</p>
        )}
      </div>
    </div>
  );
}

// ── Zain chatbot (full-height right drawer) ───────────────────────────────────
function ZainChatbot({ defaultOpen }: { defaultOpen: boolean }) {
  const [open,     setOpen]    = useState(defaultOpen);
  const [calling,  setCalling] = useState(false);
  const [input,    setInput]   = useState('');
  const [messages, setMsgs]    = useState<Message[]>([GREETING]);
  const bottomRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const q = text.toLowerCase();
    let reply: Message;

    if (q.includes('smart search') || q.includes('search software') || q.includes('find software')) {
      reply = { role: 'assistant', text: 'Smart Search lets you browse all 50+ products with AI-powered compatibility scoring.',
        toolLink: { label: 'Open Smart Search →', href: '/software' } };
    } else if (q.includes('strateg') || q.includes('roadmap') || q.includes('tech plan')) {
      reply = { role: 'assistant', text: 'The Tech Strategy Builder creates a full implementation roadmap for your business in under a minute.',
        toolLink: { label: 'Build My Strategy →', href: '/software/report/strategy' } };
    } else if (q.includes('requirement') || q.includes('rfp') || q.includes('procurement') || q.includes('document')) {
      reply = { role: 'assistant', text: 'The Tech Requirement Builder generates a professional RFP-ready document you can share with vendors.',
        toolLink: { label: 'Build Requirements →', href: '/software/report/requirements' } };
    } else if (q.includes('cost') || q.includes('saving') || q.includes('spend') || q.includes('budget') || q.includes('optim')) {
      reply = { role: 'assistant', text: 'The Cost Optimizer benchmarks your spend against GCC market pricing to uncover savings fast.',
        toolLink: { label: 'Analyse My Spend →', href: 'https://enterprise-level-redesign.vercel.app?autoauth=zv2', external: true } };
    } else {
      const hits = searchProducts(text);
      reply = hits.length > 0
        ? { role: 'assistant', text: `Found ${hits.length} product${hits.length > 1 ? 's' : ''} matching "${text}":`, products: hits }
        : { role: 'assistant', text: `I didn't find an exact match for "${text}". Try Smart Search to explore all 50+ products.`,
            toolLink: { label: 'Try Smart Search →', href: '/software' } };
    }

    setMsgs(prev => [...prev, { role: 'user', text }, reply]);
    setInput('');
  };

  const quickAction = (tool: typeof tools[0]) => {
    const reply: Message = { role: 'assistant', text: tool.desc,
      toolLink: { label: `Launch ${tool.label} →`, href: tool.href ?? '/software', external: tool.external } };
    setMsgs(prev => [...prev, { role: 'user', text: tool.label }, reply]);
  };

  return (
    <>
      {/* ── FABs: Zain avatar (chat) on top, green phone below ── */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {/* Zain avatar — opens chat */}
        <button onClick={() => setOpen(o => !o)}
          title="Chat with Zain"
          className="transition-all hover:scale-105 active:scale-95"
          style={{ filter: open ? 'drop-shadow(0 0 6px var(--color-accent))' : 'drop-shadow(0 4px 14px rgba(0,0,0,0.28))' }}>
          <img src="/zain-avatar.svg" alt="Zain" className="w-12 h-12 block" />
        </button>
        {/* Green call button — bottom */}
        <button onClick={() => setCalling(true)}
          title="Call Zain"
          className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: '#16A34A', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
          <Phone size={16} strokeWidth={2} />
        </button>
      </div>

      {/* ── Full-height right drawer ── */}
      {/* Scrim */}
      {open && (
        <div className="fixed inset-0 z-[39] bg-black/20 backdrop-blur-[2px] transition-opacity"
          onClick={() => setOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-screen z-40 flex flex-col bg-white border-l border-black/10 shadow-2xl transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ width: 'min(420px, 95vw)' }}>

        {/* Drawer header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/8 shrink-0"
          style={{ background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 100%)' }}>
          <div className="relative shrink-0">
            <img src="/zain-avatar.svg" alt="Zain" className="w-10 h-10 rounded-full" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#1a1a3a]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-white leading-none">Zain</p>
            <p className="text-[11px] text-white/50 mt-0.5">Software Gateway · AI Assistant · Online</p>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[90%]">
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <img src="/zain-avatar.svg" alt="Zain" className="w-5 h-5 rounded-full" />
                    <span className="text-[10px] font-semibold text-muted">Zain</span>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-[#f4f4f6] text-[#1a1a1a] rounded-bl-sm'
                }`} style={msg.role === 'user'
                    ? { background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }
                    : {}}>
                  {msg.text}
                </div>

                {/* Product cards */}
                {msg.products && (
                  <div className="mt-2 space-y-1.5">
                    {msg.products.map(p => (
                      <Link key={p.id} href={`/software/product/${p.slug}`}
                        className="flex items-center gap-3 bg-white border border-black/8 rounded-xl px-3.5 py-2.5 hover:border-accent/30 hover:bg-accent/4 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 shrink-0">
                          {p.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-black leading-none group-hover:text-accent transition-colors">{p.name}</p>
                          <p className="text-[10px] text-muted mt-0.5 truncate">{p.category}</p>
                        </div>
                        <ChevronRight size={12} className="text-muted group-hover:text-accent shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Tool link */}
                {msg.toolLink && (
                  msg.toolLink.external ? (
                    <a href={msg.toolLink.href} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                      {msg.toolLink.label} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <Link href={msg.toolLink.href}
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                      {msg.toolLink.label} <ArrowRight size={11} />
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}

          {/* Quick action buttons after greeting */}
          {messages.length === 1 && (
            <div className="grid grid-cols-2 gap-2 mt-1">
              {tools.map(t => (
                <button key={t.label} onClick={() => quickAction(t)}
                  className="text-left px-3 py-2.5 border border-black/8 rounded-xl text-[12px] font-medium text-[#333] hover:border-black/20 hover:bg-[#f4f4f6] transition-all leading-snug">
                  <span className="block text-muted text-[10px] mb-0.5">
                    {t.label === 'Smart Search' ? '🔍' : t.label === 'Tech Strategy Builder' ? '📊' : t.label === 'Tech Requirement Builder' ? '📋' : '💰'}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested queries bar */}
        {messages.length <= 3 && (
          <div className="px-5 py-2 border-t border-black/6 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
            {['Find CRM', 'ERP options', 'HR software', 'Best for SME'].map(q => (
              <button key={q} onClick={() => send(q)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-black/10 text-[#555] hover:border-accent/30 hover:text-accent whitespace-nowrap transition-all shrink-0">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-black/8 px-4 py-3.5 flex items-center gap-2.5 shrink-0 bg-white">
          <img src="/zain-avatar.svg" alt="Zain" className="w-7 h-7 rounded-full shrink-0" />
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask Zain anything about software…"
            className="flex-1 text-[13px] bg-[#f4f4f6] border border-black/8 rounded-xl px-3.5 py-2.5 outline-none focus:border-accent/30 focus:bg-white transition-all"
          />
          <button onClick={() => send(input)} disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 shrink-0 transition-all"
            style={{ background: input.trim() ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' : '#e5e5e5' }}>
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Voice caller overlay */}
      {calling && <BrowserCaller onClose={() => setCalling(false)} />}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SoftwareGatewayPage() {
  const [smartSearchOpen, setSmartSearchOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/dubai-chamber" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[2px]">
                {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]" />)}
              </div>
            </div>
            <span className="text-[14px] font-bold text-black tracking-tight">LOGO</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/software"
              className="flex items-center gap-1.5 bg-black text-white text-[12px] font-semibold px-4 py-2 rounded-sm hover:bg-[#333] transition-colors min-h-[36px]">
              Browse All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main section — all on first fold ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-[0.07]"
          style={{ background: 'radial-gradient(ellipse, #007AFF 0%, transparent 70%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-6">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-[0.1em] uppercase mb-4 shadow-sm shadow-accent/20">
                <Zap size={11} strokeWidth={2.5} /> Exclusive Software Gateway
              </div>
              <h2 className="text-[24px] sm:text-[32px] font-medium text-black tracking-tight leading-[1.1] mb-2.5">
                Procure the right software.<br />
                <span className="text-accent">In minutes, not months.</span>
              </h2>
              <p className="text-[13px] font-semibold text-accent mb-2 flex items-center gap-1.5">
                <Sparkles size={13} strokeWidth={2} />
                AI-powered digital collaboration hub for business growth
              </p>
              <p className="text-[13px] text-[#555] max-w-[460px] leading-[1.7]">
                Access 50+ verified products with GCC-exclusive pricing, bundle deals, and AI-powered recommendations built in.
              </p>
            </div>
            <Link href="/software"
              className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[13px] font-semibold rounded-sm hover:bg-[#222] transition-colors shrink-0 min-h-[44px] whitespace-nowrap self-start sm:self-auto">
              Browse All Software <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>

          {/* Logo strip */}
          <div className="mb-5 overflow-hidden border border-black/6 rounded-sm bg-white py-3">
            <div className="relative">
              <div className="th-logo-fade-l absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />
              <div className="th-logo-fade-r absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />
              <div className="flex items-center w-max" style={{ animation: 'marquee 32s linear infinite' }}>
                {(Array(4).fill(logos).flat() as typeof logos).map((brand, i) => (
                  <div key={i} className="flex items-center shrink-0 px-7">
                    <img src={brand.src} alt={brand.name} className="h-5 w-auto max-w-[80px] object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 tool cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {tools.map((tool, i) => {
              const accentColor = tool.color === 'var(--color-accent)' ? '#007AFF' : tool.color;
              const shared = `relative border border-black/8 rounded-sm p-5 hover:border-black/20 hover:shadow-md transition-all overflow-hidden bg-white group`;

              const inner = (
                <>
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)` }} />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center relative"
                      style={{ backgroundColor: accentColor + '14' }}>
                      <span style={{ color: tool.color }}>{tool.icon}</span>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center text-[8px] font-bold"
                        style={{ color: accentColor, borderColor: accentColor + '40' }}>
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ color: accentColor, backgroundColor: accentColor + '12', border: `1px solid ${accentColor}28` }}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-black mb-1.5 leading-tight">{tool.label}</h3>
                  <p className="text-[12px] text-[#555] leading-[1.6] mb-4">{tool.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold group-hover:gap-2 transition-all"
                    style={{ color: accentColor }}>
                    Get started {tool.external ? <ExternalLink size={11} /> : <ArrowRight size={11} />}
                  </span>
                </>
              );

              if (tool.href === null) {
                // Smart Search — opens modal
                return (
                  <button key={tool.label} className={`${shared} text-left cursor-pointer`}
                    onClick={() => setSmartSearchOpen(true)}>
                    {inner}
                  </button>
                );
              }
              if (tool.external) {
                return (
                  <a key={tool.label} href={tool.href} target="_blank" rel="noopener noreferrer"
                    className={`${shared} cursor-pointer`}>
                    {inner}
                  </a>
                );
              }
              return (
                <Link key={tool.label} href={tool.href} className={shared}>
                  {inner}
                </Link>
              );
            })}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { v: '50+', l: 'Verified products',  c: 'var(--color-accent)' },
              { v: '12',  l: 'Software categories', c: 'var(--color-accent)' },
              { v: 'Up to 40%', l: 'Bundle savings', c: 'var(--color-accent)' },
              { v: '7 days', l: 'Average activation', c: '#FF9500' },
            ].map(({ v, l, c }) => (
              <div key={l} className="border border-black/8 rounded-sm px-4 py-3 bg-white">
                <p className="text-[16px] font-semibold leading-none mb-1" style={{ color: c }}>{v}</p>
                <p className="text-[11px] text-muted">{l}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-muted">
            Powered by <span className="font-semibold text-black">Zoftware</span> · Trusted by 5,000+ businesses across MENA & GCC
          </p>
        </div>
      </section>

      {/* ── Smart Search modal ── */}
      {smartSearchOpen && <SmartSearchModal onClose={() => setSmartSearchOpen(false)} />}

      {/* ── Zain chatbot + caller ── */}
      <ZainChatbot defaultOpen={true} />
    </div>
  );
}
