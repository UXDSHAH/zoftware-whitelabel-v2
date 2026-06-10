'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search, ArrowRight, Package, BarChart2, FileText, Sparkles,
  Star, Zap, CheckCircle, X, SlidersHorizontal, Flame
} from 'lucide-react';
import TechRequirementBuilder from '@/components/TechRequirementBuilder';
import TechStrategyBuilder from '@/components/TechStrategyBuilder';
import SmartSearchPopup from '@/components/SmartSearchPopup';
import { bundles } from '@/data/bundles';
import { gatewayProducts } from '@/data/gateway-products';
import { AED_RATE } from '@/data/billing-options';

// ── Curated category filter chips ────────────────────────────────────────────
const ALL_CATS = [
  { slug: 'all',              name: 'All Products' },
  { slug: 'ai-productivity',  name: '✦ AI Products' },
  { slug: 'crm-sales',        name: 'CRM & Sales' },
  { slug: 'erp',              name: 'ERP' },
  { slug: 'finance-accounting', name: 'Finance & Accounting' },
  { slug: 'hr-payroll',       name: 'HR & Payroll' },
  { slug: 'marketing',        name: 'Marketing' },
  { slug: 'digital-workspace', name: 'Digital Workspace' },
  { slug: 'security',         name: 'Security' },
];

// ── Top 10 AI Products with current 2026 pricing ──────────────────────────────
const AI_PRODUCTS = [
  { id: 'ai-1',  name: 'Claude Pro',          vendor: 'Anthropic',  category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'claude-pro',        logo: 'Cl', tagline: 'Advanced AI for writing, coding, and complex analysis tasks.',   gcPrice: 20,  discountPct: 0,  rating: 4.9, reviews: 8420 },
  { id: 'ai-2',  name: 'ChatGPT Plus',         vendor: 'OpenAI',     category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'chatgpt-plus',      logo: 'G',  tagline: 'GPT-4o with browsing, image generation, and code interpreter.',  gcPrice: 20,  discountPct: 0,  rating: 4.8, reviews: 12300 },
  { id: 'ai-3',  name: 'Microsoft Copilot Pro', vendor: 'Microsoft',  category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'copilot-pro',       logo: 'Co', tagline: 'AI embedded in Word, Excel, PowerPoint, Outlook, and Teams.',    gcPrice: 30,  discountPct: 0,  rating: 4.6, reviews: 5100 },
  { id: 'ai-4',  name: 'GitHub Copilot',        vendor: 'GitHub',     category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'github-copilot',    logo: 'GH', tagline: 'AI pair programmer that suggests code in real-time in your IDE.', gcPrice: 10,  discountPct: 10, rating: 4.7, reviews: 9800 },
  { id: 'ai-5',  name: 'Notion AI',             vendor: 'Notion',     category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'notion-ai',         logo: 'N',  tagline: 'AI writing, summarising, and knowledge management in Notion.',   gcPrice: 10,  discountPct: 0,  rating: 4.5, reviews: 4600 },
  { id: 'ai-6',  name: 'Gemini Advanced',       vendor: 'Google',     category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'gemini-advanced',   logo: 'Ge', tagline: 'Google\'s most capable AI with 1M context window and Deep Research.', gcPrice: 20, discountPct: 0, rating: 4.6, reviews: 3900 },
  { id: 'ai-7',  name: 'Jasper AI',             vendor: 'Jasper',     category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'jasper-ai',         logo: 'Ja', tagline: 'AI content platform for marketing copy, blog posts, and campaigns.',gcPrice: 49,  discountPct: 15, rating: 4.4, reviews: 2700 },
  { id: 'ai-8',  name: 'Grammarly Business',    vendor: 'Grammarly',  category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'grammarly-business',logo: 'Gr', tagline: 'AI writing assistant with tone, clarity, and plagiarism checks.',  gcPrice: 25,  discountPct: 0,  rating: 4.5, reviews: 6100 },
  { id: 'ai-9',  name: 'Perplexity Pro',        vendor: 'Perplexity', category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'perplexity-pro',    logo: 'Px', tagline: 'AI search engine with cited answers and real-time web access.',    gcPrice: 20,  discountPct: 0,  rating: 4.6, reviews: 2100 },
  { id: 'ai-10', name: 'Gamma AI',              vendor: 'Gamma',      category: 'AI Productivity', categorySlug: 'ai-productivity', slug: 'gamma-ai',          logo: 'Gm', tagline: 'AI presentation and document builder — create decks in seconds.',  gcPrice: 15,  discountPct: 0,  rating: 4.5, reviews: 1800 },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={9} fill={i <= Math.round(rating) ? 'var(--color-accent)' : 'none'}
          className={i <= Math.round(rating) ? 'text-accent' : 'text-zinc-300'} />
      ))}
    </div>
  );
}

// ── Tool popup config ────────────────────────────────────────────────────────
const TOOL_CONFIG: Record<string, { label: string; accent: string; icon: React.ReactNode }> = {
  search:       { label: 'Smart Search',              accent: '#007AFF', icon: <Search size={13} className="text-white" /> },
  requirements: { label: 'Tech Requirements Builder', accent: '#2563EB', icon: <FileText size={13} className="text-white" /> },
  strategy:     { label: 'Tech Strategy Builder',     accent: '#7C3AED', icon: <BarChart2 size={13} className="text-white" /> },
};

function SoftwareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const activeTool = searchParams.get('tool') as 'search' | 'requirements' | 'strategy' | null;

  const [search,      setSearch]      = useState('');
  const [activeCat,   setActiveCat]   = useState('all');
  const [currency,    setCurrency]    = useState<'USD'|'AED'>('USD');
  const [onlyDeals,   setOnlyDeals]   = useState(false);
  const [toast,       setToast]       = useState(false);
  const [visibleCount,setVisible]     = useState(18);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Reset confirm when tool changes
  useEffect(() => { setShowCloseConfirm(false); }, [activeTool]);

  // Close handlers
  const handleCloseRequest = () => setShowCloseConfirm(true);
  const handleConfirmedClose = () => { router.push('/software'); setShowCloseConfirm(false); };

  // Toast nudge
  useEffect(() => {
    if (mode === 'requirements' || mode === 'strategy' || activeTool) return;
    const show = setTimeout(() => setToast(true), 2500);
    const hide = setTimeout(() => setToast(false), 9500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const fmt = (usd: number) => usd === 0 ? 'Free' :
    currency === 'AED' ? `AED ${Math.round(usd * AED_RATE)}` : `$${usd}`;

  // Filter products — AI category uses a curated list, others use gatewayProducts
  const filtered = (activeCat === 'ai-productivity'
    ? AI_PRODUCTS.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase()))
    : gatewayProducts.filter(p => {
        const matchCat    = activeCat === 'all' || p.categorySlug === activeCat;
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.vendor.toLowerCase().includes(search.toLowerCase()) ||
                            p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchDeals  = !onlyDeals || p.discountPct > 0;
        return matchCat && matchSearch && matchDeals;
      })
  ) as typeof gatewayProducts;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Gateway tools bar ── */}
      <div className="bg-zinc-900">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Zap size={13} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">Software Gateway · Powered by Zoftware</p>
              <p className="text-[11px] text-white/40">50+ verified products · GCC region pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/software?tool=requirements"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/8 transition-all whitespace-nowrap">
              <FileText size={11} /> Requirements
            </Link>
            <Link href="/software?tool=strategy"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/8 transition-all whitespace-nowrap">
              <BarChart2 size={11} /> Strategy
            </Link>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-lg ml-1">
              {(['USD','AED'] as const).map(c => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${currency === c ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="border-b border-zinc-100 bg-zinc-50">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14 py-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search 50+ software products…"
              className="w-full bg-white border border-zinc-200 pl-10 pr-4 py-2.5 text-[14px] rounded-xl outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all min-h-[42px]" />
          </div>
          <button onClick={() => setOnlyDeals(d => !d)}
            className={`flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2.5 rounded-xl border transition-all ${onlyDeals ? 'bg-orange-50 border-orange-200 text-orange-600' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300 bg-white'}`}>
            <Flame size={13} className={onlyDeals ? 'text-orange-500' : 'text-zinc-400'} />
            Hot Deals{onlyDeals ? ' ×' : ''}
          </button>
          <span className="text-[12px] text-zinc-400 shrink-0">{filtered.length} products</span>
        </div>
      </div>

      {/* ── Category filter chips ── */}
      <div className="border-b border-zinc-100 bg-white sticky top-14 z-20">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14 flex items-center gap-2 overflow-x-auto py-3 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {ALL_CATS.map(cat => (
              <button key={cat.slug} onClick={() => { setActiveCat(cat.slug); setVisible(18); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all shrink-0 border ${
                  activeCat === cat.slug
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-black'
                }`}>
                {cat.name}
                {cat.slug !== 'all' && (
                  <span className={`text-[10px] ${activeCat === cat.slug ? 'text-white/60' : 'text-zinc-400'}`}>
                    {cat.slug === 'ai-productivity' ? AI_PRODUCTS.length : gatewayProducts.filter(p => p.categorySlug === cat.slug).length}
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>

      {/* ── Main split layout ── */}
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14 py-6">
        <div className="flex gap-6 items-start">

          {/* ════ LEFT — Products (62%) ════ */}
          <div className="min-w-0" style={{ flex: '62' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-semibold text-zinc-900">
                {activeCat === 'all' ? 'All Products' : ALL_CATS.find(c => c.slug === activeCat)?.name}
                <span className="text-zinc-400 font-normal ml-2">{filtered.length} results</span>
              </p>
              {search && (
                <button onClick={() => setSearch('')} className="text-[12px] text-accent hover:underline flex items-center gap-1">
                  <X size={11}/> Clear search
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 border border-zinc-100 rounded-2xl bg-zinc-50">
                <p className="text-[16px] font-semibold text-zinc-900 mb-2">No products found</p>
                <button onClick={() => { setSearch(''); setActiveCat('all'); setOnlyDeals(false); }}
                  className="text-[13px] text-accent">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {filtered.slice(0, visibleCount).map(p => {
                    const checkoutUrl = `/checkout?product=${encodeURIComponent(p.name)}&price=${p.gcPrice}&billing=monthly&currency=${currency}&offerCode=${p.slug}-gcc`;
                    const detailUrl   = `/software/product/${p.slug}`;
                    return (
                      /* Entire card is clickable → detail page via stretched pseudo-link */
                      <div key={p.id} className="relative border border-zinc-200 rounded-2xl hover:border-zinc-300 hover:shadow-md transition-all bg-white group cursor-pointer flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                        {/* Stretched invisible link covers full card */}
                        <Link href={detailUrl} className="absolute inset-0 rounded-2xl z-0" aria-label={`View ${p.name} details`} />

                        {/* Left/Middle Content */}
                        <div className="flex-1 min-w-0 flex items-start gap-4 relative z-0 pointer-events-none">
                          {/* Logo */}
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-[12px] font-bold text-zinc-700">
                            {p.logo}
                          </div>
                          
                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-[14px] font-semibold text-zinc-900 leading-tight group-hover:text-accent transition-colors">{p.name}</p>
                              <span className="text-[11px] text-zinc-400">by {p.vendor}</span>
                              {p.discountPct > 0 && (
                                <span className="text-[9px] font-bold bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.5 rounded-full shrink-0">
                                  {p.discountPct}% OFF
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-zinc-500 leading-relaxed mb-2 line-clamp-1">{p.tagline}</p>

                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">{p.category}</span>
                              <div className="flex items-center gap-1.5">
                                <StarRow rating={p.rating} />
                                <span className="text-[10px] text-zinc-400">{p.rating} · {p.reviews.toLocaleString()} reviews</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Content — Price and CTAs */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 md:pl-4 relative z-10">
                          {/* Price */}
                          <div className="text-left md:text-right pointer-events-none">
                            {p.gcPrice === 0 ? (
                              <span className="text-[16px] font-bold text-emerald-600">Free</span>
                            ) : (
                              <div>
                                <div className="flex items-baseline gap-1 md:justify-end">
                                  <span className="text-[16px] font-bold text-zinc-900">{fmt(p.gcPrice)}</span>
                                  <span className="text-[11px] text-zinc-400">/mo</span>
                                </div>
                                <span className="text-[10px] text-accent font-medium block">
                                  {fmt(Math.round(p.gcPrice * 0.8))}/mo annual
                                </span>
                              </div>
                            )}
                          </div>

                          {/* CTAs */}
                          <div className="flex items-center gap-2">
                            <Link href={checkoutUrl}
                              className="px-4 py-2 bg-accent text-white text-[12px] font-semibold rounded-xl hover:bg-accent-hover transition-colors whitespace-nowrap">
                              Buy Now
                            </Link>
                            <Link href={detailUrl}
                              className="px-3 py-2 border border-zinc-200 text-zinc-500 text-[12px] font-medium rounded-xl hover:bg-zinc-50 transition-colors">
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filtered.length > visibleCount && (
                  <button onClick={() => setVisible(v => v + 18)}
                    className="mt-6 w-full py-3 border border-zinc-200 rounded-2xl text-[13px] font-semibold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                    Load more · {filtered.length - visibleCount} remaining
                  </button>
                )}
              </>
            )}
          </div>

          {/* ════ RIGHT — Bundles (38%) ════ */}
          <div className="shrink-0" style={{ flex: '38' }}>
            <div className="flex items-center gap-2 mb-4">
              <Package size={14} className="text-zinc-500" strokeWidth={1.5}/>
              <p className="text-[13px] font-semibold text-zinc-900">Pre-built Bundles</p>
              <span className="ml-auto text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Save up to 25%</span>
            </div>

            <div className="space-y-4">
              {bundles.map(bundle => (
                <div key={bundle.id} className="relative border rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer group"
                  style={{ borderColor: bundle.color + '35' }}>
                  {/* Stretched link — clicking anywhere goes to bundle detail */}
                  <Link href={`/bundles/${bundle.slug}`} className="absolute inset-0 rounded-2xl z-0" aria-label={`View ${bundle.name} details`} />

                  {/* Header */}
                  <div className="px-4 py-3.5 flex items-center justify-between gap-2 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${bundle.color}12, ${bundle.color}04)` }}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[15px] font-bold text-zinc-900 truncate group-hover:text-accent transition-colors">{bundle.name}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                          style={{ backgroundColor: bundle.color }}>−{bundle.savePct}%</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{bundle.tagline}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[20px] font-black leading-none" style={{ color: bundle.color }}>
                        {currency === 'AED' ? `AED ${Math.round(bundle.monthlyPrice * AED_RATE)}` : `$${bundle.monthlyPrice}`}
                      </p>
                      <p className="text-[10px] text-zinc-400 line-through">
                        {currency === 'AED' ? `AED ${Math.round(bundle.originalMonthlyPrice * AED_RATE)}` : `$${bundle.originalMonthlyPrice}`}/mo
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3.5">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3 pointer-events-none">
                      {bundle.items.map(item => (
                        <div key={item.product} className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                          <CheckCircle size={10} style={{ color: bundle.color }} className="shrink-0" strokeWidth={2.5}/>
                          <span className="truncate">{item.product}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3.5 pointer-events-none">
                      {bundle.highlights.slice(0, 3).map(h => (
                        <span key={h} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ color: bundle.color, backgroundColor: bundle.color + '10', border: `1px solid ${bundle.color}25` }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* CTAs — z-10 so they sit above the stretched link */}
                    <div className="relative z-10 flex gap-2">
                      <Link href={`/checkout?bundle=${bundle.slug}&bundleName=${encodeURIComponent(bundle.name)}&price=${bundle.monthlyPrice}&billing=monthly&currency=${currency}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold rounded-xl text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: bundle.color }}>
                        Buy Bundle <ArrowRight size={11} strokeWidth={2.5}/>
                      </Link>
                      <Link href={`/bundles/${bundle.slug}`}
                        className="px-3.5 py-2.5 text-[12px] font-semibold rounded-xl border text-zinc-500 hover:bg-zinc-50 transition-colors"
                        style={{ borderColor: bundle.color + '35' }}>
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Compare CTA */}
              <div className="border border-dashed border-zinc-200 rounded-2xl p-4 text-center">
                <p className="text-[12px] font-semibold text-zinc-700 mb-1">Need a custom bundle?</p>
                <p className="text-[11px] text-zinc-400 mb-3">Our team builds tailored packages for your stack</p>
                <a href="mailto:success@zoftware.com"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent hover:underline">
                  Talk to us <ArrowRight size={11}/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast nudge ── */}
      <div className={`fixed bottom-24 left-4 sm:left-6 z-50 max-w-[300px] transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-zinc-900 text-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white leading-tight mb-0.5">Not sure where to start?</p>
              <p className="text-[11px] text-white/50 leading-snug">Answer 10 quick questions and get matched software.</p>
            </div>
            <button onClick={() => setToast(false)} className="text-white/30 hover:text-white shrink-0 p-0.5"><X size={14}/></button>
          </div>
          <div className="h-0.5 bg-white/10">
            <div className="h-full bg-accent" style={{ animation: toast ? 'shrink 7s linear forwards' : 'none' }}/>
          </div>
        </div>
      </div>
      <style>{`@keyframes shrink{from{width:100%}to{width:0%}}`}</style>

      {/* ── Tool popup modal ── */}
    {activeTool && TOOL_CONFIG[activeTool] && (() => {
      const cfg = TOOL_CONFIG[activeTool];
      return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseRequest} />

          {/* Panel */}
          <div className="relative bg-white flex flex-col w-full h-full sm:max-w-[min(96vw,1100px)] sm:h-[92vh] sm:rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: cfg.accent }}>
                  {cfg.icon}
                </div>
                <span className="text-[14px] font-semibold text-zinc-900">{cfg.label}</span>
              </div>
              <button onClick={handleCloseRequest}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 transition-colors">
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeTool === 'search'       && <SmartSearchPopup onClose={handleCloseRequest} />}
              {activeTool === 'requirements' && <TechRequirementBuilder onClose={handleConfirmedClose} />}
              {activeTool === 'strategy'     && <TechStrategyBuilder onClose={handleConfirmedClose} />}
            </div>
          </div>

          {/* Close confirmation dialog */}
          {showCloseConfirm && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                <p className="text-[16px] font-semibold text-zinc-900 mb-1.5">
                  Close {cfg.label}?
                </p>
                <p className="text-[13px] text-zinc-500 mb-5 leading-relaxed">
                  Your current progress will be lost if you close now.
                </p>
                <div className="flex gap-2.5">
                  <button onClick={() => setShowCloseConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                    Continue working
                  </button>
                  <button onClick={handleConfirmedClose}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-black transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    })()}
    </div>
  );
}

export default function SoftwarePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[13px] text-zinc-400">Loading…</div>}>
      <SoftwareContent />
    </Suspense>
  );
}
