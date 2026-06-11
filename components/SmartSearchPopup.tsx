'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, Check, SlidersHorizontal, ArrowRight, Star, Phone, X } from 'lucide-react';
import { gatewayProducts } from '@/data/gateway-products';

// ── Constants ────────────────────────────────────────────────────────────────

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

const SYNONYMS: Record<string, string[]> = {
  hrms:  ['hr','human resources','payroll','workforce','people','talent'],
  hris:  ['hr','human resources','payroll','workforce'],
  crm:   ['customer','sales','pipeline','contact','lead'],
  erp:   ['enterprise','resource','operations','finance','accounting'],
  scm:   ['supply chain','inventory','logistics','warehouse'],
  cms:   ['content','marketing','website'],
  lms:   ['learning','training','elearning','course'],
  bi:    ['analytics','reporting','dashboard','intelligence'],
  itsm:  ['it service','helpdesk','ticketing','support','service desk'],
  iam:   ['identity','access','authentication','sso'],
  wfm:   ['workforce','scheduling','attendance','time tracking'],
  ai:    ['artificial intelligence','machine learning','automation'],
};
const STOP_WORDS = new Set(['and','or','the','for','a','an','in','of','to','with','that','is','are','on','at','by','from']);

function expandTokens(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const t of tokens) {
    if (SYNONYMS[t]) SYNONYMS[t].forEach(s => s.split(' ').forEach(w => out.add(w)));
  }
  return [...out];
}

function getScore(p: typeof gatewayProducts[0], q: string): number {
  if (!q.trim()) return Math.round(60 + p.rating * 6);
  const rawTokens = q.toLowerCase().split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
  if (rawTokens.length === 0) return Math.round(60 + p.rating * 6);
  const tokens = expandTokens(rawTokens);
  const name     = p.name.toLowerCase();
  const category = p.category.toLowerCase();
  const vendor   = p.vendor.toLowerCase();
  const tagline  = p.tagline.toLowerCase();
  const tags     = p.tags.join(' ').toLowerCase();
  const overview = ((p as Record<string, unknown>).overview as string ?? '').toLowerCase();
  const haystack = [name, category, vendor, tagline, tags, overview].join(' ');
  let s = 50;
  for (const t of tokens) {
    if (name.includes(t))     s += 28;
    if (category.includes(t)) s += 20;
    if (vendor.includes(t))   s += 14;
    if (tagline.includes(t))  s += 12;
    if (tags.includes(t))     s += 8;
    if (overview.includes(t)) s += 4;
    if (haystack.split(/\s+/).some(w => w.startsWith(t))) s += 3;
  }
  return Math.min(97, s);
}

const scoreColor = (s: number) =>
  s >= 85 ? '#16A34A' : s >= 70 ? '#D97706' : '#6366F1';

// ── SmartSearchPopup — renders inline (no overlay wrapper) ───────────────────

export default function SmartSearchPopup({ onClose }: { onClose: () => void }) {
  const [step,        setStep]        = useState<1 | 2 | 3>(1);
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
    const scored = gatewayProducts
      .map(p => ({ ...p, score: getScore(p, q) }))
      .sort((a, b) => b.score - a.score);
    let filtered = [...scored];
    if (budget && budget !== 'b4') {
      const r = SS_BUDGETS.find(b => b.id === budget);
      if (r) filtered = filtered.filter(p => p.gcPrice >= r.min && p.gcPrice <= r.max);
    }
    if (companySize) {
      const allowed = SS_SIZE_MAP[companySize] || [];
      filtered = filtered.filter(p => p.targetSize.some(s => allowed.includes(s)));
    }
    if (filtered.length === 0) filtered = scored;
    const relevant = filtered.filter(p => p.score > 50);
    const final = relevant.length >= 3 ? relevant : filtered.slice(0, 6);
    return final.slice(0, 12);
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

  // ── STEP 1: Search + Filters ─────────────────────────────────────────────
  if (step === 1) return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h2 className="text-[22px] font-semibold text-black leading-tight mb-1.5">
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
          <p className="text-[12px] font-semibold text-zinc-600 mb-2.5">Budget</p>
          <div className="flex flex-wrap gap-2">
            {SS_BUDGETS.map(b => (
              <button key={b.id} onClick={() => setBudget(budget === b.id ? null : b.id)}
                className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                  budget === b.id ? 'bg-black text-white border-black' : 'border-black/15 text-zinc-600 hover:border-black/30 hover:bg-black/4'
                }`}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[12px] font-semibold text-zinc-600 mb-2.5">Company Size</p>
          <div className="flex flex-wrap gap-2">
            {SS_SIZES.map(s => (
              <button key={s} onClick={() => setCompanySize(companySize === s ? null : s)}
                className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                  companySize === s ? 'bg-black text-white border-black' : 'border-black/15 text-zinc-600 hover:border-black/30 hover:bg-black/4'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-semibold text-zinc-600 mb-2.5">
            Industry <span className="text-muted font-normal text-[11px]">(optional)</span>
          </p>
          <input value={industry} onChange={e => setIndustry(e.target.value)}
            placeholder="e.g. Healthcare, Finance, Retail, Manufacturing…"
            className="w-full px-4 py-2.5 text-[13px] border border-black/12 rounded-xl outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-[#fafafa] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="border-t border-black/8 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
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
  );

  // ── STEP 2: Results ──────────────────────────────────────────────────────
  if (step === 2) return (
    <div className="flex flex-col h-full">
      {/* Sub-nav */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-black/8 shrink-0 bg-[#fafafa]">
        <button onClick={() => { setStep(1); setSelected([]); }}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[18px] leading-none text-muted hover:text-black hover:bg-surface transition-colors shrink-0">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-black truncate">
            {query ? `Results for "${query}"` : 'All Products'}
          </p>
          <p className="text-[11px] text-muted">{results.length} matches found</p>
        </div>
        <button
          className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-accent border border-accent/30 hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg shrink-0 transition-all">
          Build RFP →
        </button>
        {selected.length >= 2 && (
          <button onClick={() => setStep(3)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            <SlidersHorizontal size={11} /> Compare ({selected.length})
          </button>
        )}
        <button onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 transition-colors shrink-0">
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[15px] font-semibold text-black mb-2">No products match your criteria</p>
              <p className="text-[12px] text-muted mb-4">Try adjusting your filters or broadening your search.</p>
              <button onClick={() => setStep(1)}
                className="text-[12px] font-semibold text-accent hover:underline">← Adjust filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map(p => {
                const sc = p.score;
                const col = scoreColor(sc);
                const isSel = selected.includes(p.id);
                return (
                  <div key={p.id}
                    className={`relative rounded-xl border p-4 transition-all ${
                      isSel ? 'border-accent/40 bg-accent/3 shadow-sm' : 'border-black/8 bg-white hover:border-black/20 hover:shadow-md'
                    }`}>
                    <div className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: col + '18', color: col }}>
                      {sc}% match
                    </div>
                    <div className="flex items-start gap-3 mb-2.5 pr-20">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[11px] font-bold text-zinc-600 shrink-0">
                        {p.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-black leading-tight">{p.name}</p>
                        <p className="text-[10px] text-muted">{p.vendor} · {p.category}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-600 leading-snug mb-3 line-clamp-2">{p.tagline}</p>
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
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleSelect(p.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold py-1.5 rounded-lg border transition-all ${
                          isSel ? 'border-accent/50 text-accent bg-accent/8' : 'border-black/12 text-zinc-600 hover:border-black/25'
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
        <div className="hidden lg:flex w-[200px] shrink-0 border-l border-black/8 overflow-y-auto flex-col gap-3 px-4 py-4">
          <div className="rounded-xl border border-black/8 p-4 bg-[#fafafa]">
            <p className="text-[12px] font-bold text-black mb-3">Refine your match</p>
            <ul className="space-y-2 mb-4">
              {['See precise fit %', 'Get accurate pricing', 'Auto-draft your RFP'].map(item => (
                <li key={item} className="flex items-start gap-2 text-[11px] text-zinc-600 leading-snug">
                  <Check size={10} className="text-green-500 mt-0.5 shrink-0" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
            <Link href="/software?tool=requirements"
              className="flex items-center justify-center text-[11px] font-semibold text-white w-full py-2 rounded-lg"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}
              onClick={onClose}>
              Start RFP Builder →
            </Link>
          </div>

          <div className="rounded-xl border border-black/8 p-4 bg-[#fafafa]">
            <p className="text-[12px] font-bold text-black mb-1">Expert advice</p>
            <p className="text-[10px] text-muted mb-3 leading-[1.5]">Tailored to your industry and budget.</p>
            <button className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-accent border border-accent/30 w-full py-2 rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all">
              <Phone size={11} /> Talk to Advisor
            </button>
          </div>

          {selected.length > 0 && (
            <div className="rounded-xl border border-accent/25 p-4 bg-accent/4">
              <p className="text-[11px] font-bold text-accent mb-2">{selected.length} selected</p>
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
  );

  // ── STEP 3: Compare table ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Sub-nav */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-black/8 shrink-0 bg-[#fafafa]">
        <button onClick={() => setStep(2)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[18px] leading-none text-muted hover:text-black hover:bg-surface transition-colors shrink-0">
          ←
        </button>
        <p className="text-[13px] font-semibold text-black flex-1">
          Comparing {compareList.length} product{compareList.length !== 1 ? 's' : ''}
        </p>
        <button onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 transition-colors shrink-0">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="border-collapse"
          style={{ minWidth: `${160 + compareList.length * 240}px`, width: '100%' }}>
          <thead>
            <tr>
              <th className="sticky left-0 bg-white z-10 border-b border-r border-black/8 p-4 w-[160px] min-w-[160px]" />
              {compareList.map(p => (
                <th key={p.id} className="border-b border-r last:border-r-0 border-black/8 p-5 text-left min-w-[220px] align-top">
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
            {[
              { label: 'Pricing', render: (p: typeof compareList[0]) => (
                <>
                  <p className="text-[14px] font-bold text-black">{p.gcPrice === 0 ? 'Free' : `$${p.gcPrice}/mo`}</p>
                  {p.discountPct > 0 && <p className="text-[10px] text-green-600 font-semibold mt-0.5">{p.discountPct}% GCC discount</p>}
                </>
              )},
              { label: 'Rating', render: (p: typeof compareList[0]) => (
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={11} fill={i <= Math.round(p.rating) ? '#F59E0B' : 'none'}
                      className={i <= Math.round(p.rating) ? 'text-amber-400' : 'text-zinc-300'} />
                  ))}
                  <span className="text-[12px] font-bold text-black ml-0.5">{p.rating}</span>
                </div>
              )},
              { label: 'Overview', render: (p: typeof compareList[0]) => <p className="text-[11px] text-zinc-600 leading-[1.65]">{p.tagline}</p> },
              { label: 'Best for', render: (p: typeof compareList[0]) => (
                <div className="flex flex-wrap gap-1">
                  {p.targetSize.map(s => <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/6 text-zinc-600">{s}</span>)}
                </div>
              )},
              { label: 'Competitive Advantage', render: (p: typeof compareList[0]) => <p className="text-[11px] text-zinc-600 leading-[1.65]">{p.usp || p.tagline}</p> },
              { label: 'Features', render: (p: typeof compareList[0]) => (
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0, 6).map(t => <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-surface text-zinc-600 border border-black/8">{t}</span>)}
                  {p.tags.length > 6 && <span className="text-[9px] text-muted self-center">+{p.tags.length - 6} more</span>}
                </div>
              )},
              { label: 'Deployment', render: (p: typeof compareList[0]) => <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/6 text-zinc-700">{p.deployment}</span> },
              { label: 'Integrations', render: (p: typeof compareList[0]) => (
                <div className="flex flex-wrap gap-1">
                  {p.integrations.slice(0, 5).map(i => <span key={i} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{i}</span>)}
                  {p.integrations.length > 5 && <span className="text-[9px] text-muted self-center">+{p.integrations.length - 5} more</span>}
                </div>
              )},
              { label: 'Supports', render: (p: typeof compareList[0]) => <p className="text-[11px] text-zinc-600">{SS_SUPPORTS[p.deployment] || 'Web · iOS · Android'}</p> },
            ].map(({ label, render }) => (
              <tr key={label} className="border-b border-black/6 hover:bg-[#fafafa] transition-colors">
                <td className="sticky left-0 bg-white z-10 px-4 py-4 border-r border-black/8">
                  <p className="text-[11px] font-bold text-zinc-700">{label}</p>
                </td>
                {compareList.map(p => (
                  <td key={p.id} className="px-5 py-4 border-r last:border-r-0 border-black/8 align-top">
                    {render(p)}
                  </td>
                ))}
              </tr>
            ))}
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
  );
}
