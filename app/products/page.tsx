'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Star, ArrowRight, Check, Plus, X, ChevronDown } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { Suspense } from 'react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10} fill={i <= Math.round(rating) ? '#007AFF' : 'none'} className={i <= Math.round(rating) ? 'text-accent' : 'text-[#e5e5e7]'} />
      ))}
      <span className="text-[11px] font-medium text-black ml-1">{rating}</span>
    </div>
  );
}

const deploymentOptions = ['Cloud', 'On-Premise', 'Hybrid'];
const sizeOptions = ['SME', 'Mid-Market', 'Enterprise'];
const priceRanges = [
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under $20/mo', min: 1, max: 20 },
  { label: '$20 – $50/mo', min: 20, max: 50 },
  { label: '$50 – $100/mo', min: 50, max: 100 },
  { label: '$100+/mo', min: 100, max: 99999 },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const qParam = searchParams.get('q') || '';

  const [search, setSearch] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedDeployment, setSelectedDeployment] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'best-match' | 'rating' | 'reviews' | 'price-asc' | 'price-desc'>('best-match');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'AED'>('USD');
  const [filterOpen, setFilterOpen] = useState(false);

  const aedRate = 3.67;

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    if (currency === 'AED') return `AED ${Math.round(price * aedRate)}`;
    return `$${price}`;
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    if (selectedCategory) list = list.filter(p => p.categorySlug === selectedCategory);
    if (selectedDeployment.length) list = list.filter(p => selectedDeployment.includes(p.deployment));
    if (selectedSizes.length) list = list.filter(p => p.targetSize.some(s => selectedSizes.includes(s)));
    if (selectedPrice) {
      const range = priceRanges.find(r => r.label === selectedPrice);
      if (range) list = list.filter(p => p.startingPrice >= range.min && p.startingPrice <= range.max);
    }
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'reviews') list.sort((a, b) => b.reviews - a.reviews);
    else if (sortBy === 'price-asc') list.sort((a, b) => a.startingPrice - b.startingPrice);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.startingPrice - a.startingPrice);
    else list.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
    return list;
  }, [search, selectedCategory, selectedDeployment, selectedSizes, selectedPrice, sortBy]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Page header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-1.5">Software Catalog</p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-medium text-black tracking-tight leading-[1.1] mb-1">
              {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Software'}
            </h1>
            <p className="text-[13px] text-muted">{filtered.length} products {selectedCategory ? `in this category` : 'available'}</p>
          </div>
          {/* Mobile filter button */}
          <button onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium rounded-sm hover:bg-surface transition-colors min-h-[44px]">
            <SlidersHorizontal size={14} /> Filters
            {(selectedDeployment.length + selectedSizes.length + (selectedPrice ? 1 : 0) + (selectedCategory ? 1 : 0)) > 0 && (
              <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {selectedDeployment.length + selectedSizes.length + (selectedPrice ? 1 : 0) + (selectedCategory ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white w-72 max-w-[85vw] h-full overflow-y-auto p-5 ml-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[15px] font-semibold text-black">Filters</p>
              <button onClick={() => setFilterOpen(false)} className="text-muted hover:text-black">
                <X size={18} />
              </button>
            </div>
            {/* Category */}
            <div className="mb-5">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2.5">Category</p>
              {categories.map(cat => (
                <button key={cat.slug} onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-[13px] rounded-sm mb-0.5 transition-colors ${selectedCategory === cat.slug ? 'bg-accent text-white font-medium' : 'text-[#333333] hover:bg-surface'}`}>
                  <span>{cat.name}</span><span className="opacity-60">{cat.count}</span>
                </button>
              ))}
            </div>
            {/* Deployment */}
            <div className="mb-5">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2.5">Deployment</p>
              {deploymentOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2.5 py-2 cursor-pointer">
                  <div onClick={() => setSelectedDeployment(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors cursor-pointer ${selectedDeployment.includes(opt) ? 'bg-accent border-accent' : 'border-black/20 bg-white'}`}>
                    {selectedDeployment.includes(opt) && <Check size={10} className="text-white" strokeWidth={2.5} />}
                  </div>
                  <span className="text-[13px] text-[#333333]">{opt}</span>
                </label>
              ))}
            </div>
            {/* Price */}
            <div className="mb-5">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2.5">Price Range</p>
              {priceRanges.map(range => (
                <button key={range.label} onClick={() => setSelectedPrice(selectedPrice === range.label ? '' : range.label)}
                  className={`w-full flex px-2.5 py-2 text-[13px] rounded-sm mb-0.5 transition-colors ${selectedPrice === range.label ? 'bg-accent text-white font-medium' : 'text-[#333333] hover:bg-surface'}`}>
                  {range.label}
                </button>
              ))}
            </div>
            <button onClick={() => { setSelectedCategory(''); setSelectedDeployment([]); setSelectedSizes([]); setSelectedPrice(''); setFilterOpen(false); }}
              className="w-full py-2.5 text-[13px] font-medium border border-black/10 rounded-sm hover:bg-surface transition-colors mt-2">
              Clear All Filters
            </button>
            <button onClick={() => setFilterOpen(false)}
              className="w-full py-2.5 text-[13px] font-medium bg-accent text-white rounded-sm hover:bg-accent-hover transition-colors mt-2">
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-8">

        {/* Sidebar Filters — desktop */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="sticky top-20">

            {/* Search */}
            <div className="relative mb-6">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-surface pl-8 pr-3 py-2 text-[12px] placeholder-muted rounded-sm outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2.5">Category</p>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] rounded-sm mb-0.5 transition-colors ${selectedCategory === cat.slug ? 'bg-accent text-white font-medium' : 'text-[#333333] hover:bg-surface'}`}
                >
                  <span>{cat.name}</span>
                  <span className={selectedCategory === cat.slug ? 'text-white/60' : 'text-muted'}>{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Deployment */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2.5">Deployment</p>
              {deploymentOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                  <div
                    onClick={() => setSelectedDeployment(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors cursor-pointer ${selectedDeployment.includes(opt) ? 'bg-accent border-accent' : 'border-black/20 bg-white group-hover:border-black/40'}`}
                  >
                    {selectedDeployment.includes(opt) && <Check size={10} className="text-white" strokeWidth={2.5} />}
                  </div>
                  <span className="text-[12px] text-[#333333]">{opt}</span>
                </label>
              ))}
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2.5">Price Range</p>
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPrice(selectedPrice === range.label ? '' : range.label)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] rounded-sm mb-0.5 transition-colors ${selectedPrice === range.label ? 'bg-accent text-white font-medium' : 'text-[#333333] hover:bg-surface'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Company Size */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2.5">Company Size</p>
              {sizeOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                  <div
                    onClick={() => setSelectedSizes(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors cursor-pointer ${selectedSizes.includes(opt) ? 'bg-accent border-accent' : 'border-black/20 bg-white group-hover:border-black/40'}`}
                  >
                    {selectedSizes.includes(opt) && <Check size={10} className="text-white" strokeWidth={2.5} />}
                  </div>
                  <span className="text-[12px] text-[#333333]">{opt}</span>
                </label>
              ))}
            </div>

          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Sort + Currency bar */}
          <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-black/8 overflow-x-auto">
            <div className="flex items-center gap-1 bg-surface p-0.5 rounded-sm shrink-0">
              {(['best-match', 'rating', 'reviews', 'price-asc'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-medium rounded-sm transition-all whitespace-nowrap ${sortBy === s ? 'bg-white text-black shadow-sm' : 'text-muted hover:text-black'}`}
                >
                  {{ 'best-match': 'Best Match', rating: 'Top Rated', reviews: 'Most Reviewed', 'price-asc': 'Price ↑' }[s]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-surface p-0.5 rounded-sm shrink-0">
              {(['USD', 'AED'] as const).map(c => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold rounded-sm transition-all ${currency === c ? 'bg-white text-black shadow-sm' : 'text-muted hover:text-black'}`}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(product => {
              const inCompare = compareList.includes(product.id);
              return (
                <div key={product.id} className="bg-white border border-black/8 rounded-sm hover:border-black/20 transition-all flex flex-col">
                  <Link href={`/products/${product.slug}`} className="p-5 flex-1 block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-surface border border-black/8 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-black">{product.logo}</span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-black leading-tight">{product.name}</p>
                          <p className="text-[11px] text-muted">{product.deployment} · {product.category}</p>
                        </div>
                      </div>
                      {product.fitScore && (
                        <span className="bg-[#dcfce7] text-[#16a34a] text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0">{product.fitScore}%</span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#555555] leading-[1.5] mb-3 line-clamp-2">{product.tagline}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0,3).map(tag => (
                        <span key={tag} className="bg-surface text-muted text-[10px] px-2 py-0.5 rounded-sm">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <StarRating rating={product.rating} />
                      <p className="text-[11px] text-muted">({product.reviews.toLocaleString()})</p>
                    </div>
                  </Link>
                  <div className="px-5 pb-4 pt-3 border-t border-black/5 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-black">{formatPrice(product.startingPrice)}</p>
                      {product.startingPrice > 0 && <p className="text-[10px] text-muted">per user/month</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-sm border transition-colors ${inCompare ? 'bg-black text-white border-black' : 'bg-white text-[#333333] border-black/10 hover:border-black/30'}`}
                      >
                        {inCompare ? <><Check size={10} strokeWidth={2.5} /> Added</> : <><Plus size={10} strokeWidth={2} /> Compare</>}
                      </button>
                      <Link href={`/products/${product.slug}`}
                        className="flex items-center gap-1 bg-accent text-white px-3 py-1.5 text-[11px] font-medium rounded-sm hover:bg-accent-hover transition-colors">
                        View <ArrowRight size={11} strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[17px] font-semibold text-black mb-2">No products found</p>
              <p className="text-[13px] text-muted">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-[15px] font-medium text-white">{compareList.length} product{compareList.length > 1 ? 's' : ''} selected</p>
              <p className="text-[11px] text-white/60">{5 - compareList.length} more can be added</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCompareList([])} className="flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white transition-colors">
                <X size={14} /> Clear
              </button>
              <Link href="/compare" className="flex items-center gap-2 bg-accent text-white px-5 py-2 text-[13px] font-semibold rounded-sm hover:bg-accent-hover transition-colors">
                Compare Now <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-[13px] text-muted">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
