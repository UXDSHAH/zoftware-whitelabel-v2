'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Star, ChevronRight, Zap, Package,
  CheckCircle, Search, X, Flame, TrendingUp
} from 'lucide-react';
import { getCategoryBySlug, softwareCategories } from '@/data/software-categories';
import { getCatalogByCategory, CatalogProduct } from '@/data/products-catalog';
import { getGatewayProductsByCategory } from '@/data/gateway-products';
import { bundles } from '@/data/bundles';
import { AED_RATE } from '@/data/billing-options';

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10} fill={i <= Math.round(rating) ? '#007AFF' : 'none'}
          className={i <= Math.round(rating) ? 'text-[#007AFF]' : 'text-[#e5e5e7]'} />
      ))}
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = getCategoryBySlug(slug);
  if (!category) return notFound();

  // Pull from full catalog (50+ products) + gateway products for detail pages
  const allProducts = getCatalogByCategory(slug);
  const gatewayProds = getGatewayProductsByCategory(slug);

  // If catalog has products, use them; else show gateway products
  const products = allProducts.length > 0 ? allProducts : gatewayProds.map(p => ({
    id: p.id, slug: p.slug, name: p.name, vendor: p.vendor,
    category: p.category, categorySlug: p.categorySlug, tagline: p.tagline,
    logo: p.logo, gcPrice: p.gcPrice, originalPrice: p.originalPrice,
    discountPct: p.discountPct, rating: p.rating, reviews: p.reviews,
    tags: p.tags, hasDetailPage: true, featured: true,
  } as CatalogProduct));

  const relatedBundles = bundles.filter(b =>
    b.items.some(item => products.some(p => p.name.includes(item.product.split(' ')[0])))
  );

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'AED'>('USD');
  const [search, setSearch] = useState('');
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const [trendingIdx, setTrendingIdx] = useState(0);

  // Auto-rotate trending products every 2s
  const trendingProducts = products.filter(p => p.rating >= 4.4).slice(0, 8);
  useEffect(() => {
    if (trendingProducts.length < 2) return;
    const t = setInterval(() => setTrendingIdx(i => (i + 1) % trendingProducts.length), 2000);
    return () => clearInterval(t);
  }, [trendingProducts.length]);

  const multiplier = billingCycle === 'annual' ? 0.8 : 1;

  // fmt: when annual, shows 12-month total price
  const fmt = (price: number) => {
    if (price === 0) return 'Free';
    if (billingCycle === 'annual') {
      const annual = price * 0.8 * 12;
      return currency === 'AED'
        ? `AED ${Math.round(annual * AED_RATE).toLocaleString()}`
        : `$${annual.toFixed(0)}`;
    }
    return currency === 'AED'
      ? `AED ${Math.round(price * AED_RATE)}`
      : `$${price.toFixed(2)}`;
  };

  const fmtMonthly = (price: number) => {
    if (price === 0) return 'Free';
    return currency === 'AED'
      ? `AED ${Math.round(price * AED_RATE)}`
      : `$${price.toFixed(2)}`;
  };

  const fmtOriginal = (price: number) => {
    if (price === 0) return 'Free';
    return currency === 'AED'
      ? `AED ${Math.round(price * AED_RATE)}`
      : `$${price.toFixed(2)}`;
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiscount = !showOnlyDiscounted || p.discountPct > 0;
    return matchSearch && matchDiscount;
  });

  return (
    <div className="min-h-screen bg-white pb-24">

      {/* Breadcrumb */}
      <div className="border-b border-black/8 bg-[#f9fafb]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 overflow-x-auto">
          <Link href="/software" className="flex items-center gap-1 text-[12px] text-[#86868b] hover:text-black transition-colors shrink-0 min-h-[36px] items-center">
            <ArrowLeft size={11} /> Software
          </Link>
          <ChevronRight size={10} className="text-[#c7c7cc] shrink-0" />
          <span className="text-[12px] text-black font-medium truncate">{category.name}</span>
        </div>
      </div>

      {/* ── Currency toggle — top bar ── */}
      <div className="border-b border-black/6 bg-[#f9fafb]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-4">
          <p className="text-[11px] text-[#86868b]">
            Showing prices in <span className="font-semibold text-black">{currency}</span>
          </p>
          <div className="flex items-center gap-1 bg-white border border-black/10 p-0.5 rounded-sm shadow-sm">
            {(['USD', 'AED'] as const).map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`px-4 py-1 text-[11px] font-bold rounded-sm transition-all ${currency === c ? 'bg-black text-white shadow-sm' : 'text-[#86868b] hover:text-black'}`}>
                {c === 'USD' ? '$ USD' : 'AED'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page header — 2-col: info left, trending chips right */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-5">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 lg:items-start">

          {/* Left — category info + filters */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-[#86868b] tracking-[0.1em] uppercase mb-1">{category.count} tools · GCC region</p>
            <h1 className="text-[24px] sm:text-[32px] font-semibold text-black tracking-tight mb-2">{category.name}</h1>
            <p className="text-[13px] sm:text-[14px] text-[#555] leading-[1.65] mb-4">{category.description}</p>

            {/* Subcategory pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {category.subcategories.slice(0, 6).map(sub => (
                <span key={sub} className="text-[11px] font-medium px-2.5 py-1 rounded-sm border border-black/10 text-[#555] bg-white">{sub}</span>
              ))}
              {category.subcategories.length > 6 && (
                <span className="text-[11px] text-[#86868b] px-2.5 py-1">+{category.subcategories.length - 6} more</span>
              )}
            </div>

            {/* Controls row — search + hot deals only (annual toggle removed) */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                  className="bg-[#f5f5f7] border-0 pl-8 pr-3 py-2 text-[12px] rounded-sm outline-none focus:ring-2 focus:ring-[#007AFF]/20 w-40 sm:w-56 min-h-[36px]" />
              </div>
              <button onClick={() => setShowOnlyDiscounted(d => !d)}
                className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-sm border transition-colors min-h-[34px] ${showOnlyDiscounted ? 'bg-[#fff7ed] border-[#f97316]/30 text-[#ea580c]' : 'border-black/10 text-[#555] hover:border-black/20'}`}>
                <Flame size={11} className={showOnlyDiscounted ? 'text-[#ea580c]' : 'text-[#86868b]'} />
                {showOnlyDiscounted ? 'Hot Deals ×' : 'Hot Deals'}
              </button>
              <span className="text-[12px] text-[#86868b] ml-auto">{filtered.length} products</span>
            </div>
          </div>

          {/* Right — Trending / Hot products chips */}
          {trendingProducts.length > 0 && (
            <div className="lg:w-64 shrink-0">
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp size={12} className="text-[#ea580c]" />
                <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em]">Hot in {category.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {trendingProducts.slice(0, 6).map(tp => (
                  <Link key={tp.id} href={`/software/product/${tp.slug}`}
                    className="flex items-center gap-2 border border-black/8 rounded-sm px-2.5 py-2 bg-white hover:border-[#007AFF]/25 hover:bg-[#f8fbff] transition-all group">
                    <div className="w-7 h-7 rounded-sm bg-[#f5f5f7] flex items-center justify-center shrink-0 text-[9px] font-bold text-black">{tp.logo}</div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-black truncate leading-tight group-hover:text-[#007AFF] transition-colors">{tp.name}</p>
                      <p className="text-[10px] text-[#86868b]">
                        {tp.gcPrice === 0 ? 'Free' : `$${tp.gcPrice}/mo`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex gap-8 items-start">

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-16 border border-black/8 rounded-sm">
                <p className="text-[16px] font-semibold text-black mb-2">No products match your filter</p>
                <button onClick={() => { setSearch(''); setShowOnlyDiscounted(false); }}
                  className="text-[13px] text-[#007AFF]">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(product => {
                  const checkoutUrl = `/checkout?product=${encodeURIComponent(product.name)}&plan=Standard&price=${product.gcPrice}&billing=${billingCycle}&currency=${currency}&offerCode=${product.slug}-gcc`;
                  const detailUrl = product.hasDetailPage
                    ? `/software/product/${product.slug}`
                    : null;

                  return (
                    <div key={product.id} className="border border-black/8 rounded-sm hover:border-black/20 hover:shadow-sm transition-all flex flex-col bg-white">
                      {/* Product body */}
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-sm bg-[#f5f5f7] border border-black/8 flex items-center justify-center shrink-0">
                              <span className="text-[11px] font-bold text-black">{product.logo}</span>
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-black leading-tight">{product.name}</p>
                              <p className="text-[10px] text-[#86868b]">{product.vendor}</p>
                            </div>
                          </div>
                          {product.discountPct > 0 && (
                            <span className="text-[9px] font-bold bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded-sm shrink-0">
                              {product.discountPct}% OFF
                            </span>
                          )}
                        </div>

                        <p className="text-[12px] text-[#555] leading-[1.5] mb-3 line-clamp-2">{product.tagline}</p>

                        {/* Pricing — monthly + annual side by side */}
                        <div className="mb-2">
                          {product.gcPrice === 0 ? (
                            <span className="text-[18px] font-semibold text-[#16a34a]">Free</span>
                          ) : (
                            <>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-[18px] font-semibold text-black">{fmtMonthly(product.gcPrice)}</span>
                                <span className="text-[11px] text-[#86868b]">/mo</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] text-[#007AFF] font-medium">
                                  Annual: {currency === 'AED'
                                    ? `AED ${Math.round(product.gcPrice * 0.8 * AED_RATE)}`
                                    : `$${(product.gcPrice * 0.8).toFixed(2)}`}/mo
                                </span>
                                <span className="text-[9px] font-bold text-[#007AFF] bg-[#007AFF]/10 px-1 py-0.5 rounded-sm">−20%</span>
                              </div>
                              {product.discountPct > 0 && (
                                <span className="text-[11px] text-[#86868b] line-through">{fmtOriginal(product.originalPrice)}</span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <StarRow rating={product.rating} />
                          <span className="text-[11px] text-[#86868b]">{product.rating} · {product.reviews.toLocaleString()}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] bg-[#f5f5f7] text-[#86868b] px-1.5 py-0.5 rounded-sm">{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* CTAs — always Buy Now + View Details */}
                      <div className="px-4 pb-4 pt-3 border-t border-black/5 flex items-center gap-2">
                        <Link href={checkoutUrl}
                          className="flex-1 flex items-center justify-center gap-1 bg-[#007AFF] text-white py-2.5 text-[12px] font-semibold rounded-sm hover:bg-[#0051D5] transition-colors min-h-[44px]">
                          Buy Now <ArrowRight size={11} strokeWidth={2} />
                        </Link>
                        <Link href={`/software/product/${product.slug}`}
                          className="flex items-center justify-center border border-black/10 text-black px-3 py-2.5 text-[12px] font-medium rounded-sm hover:bg-[#f5f5f7] transition-colors min-h-[44px]">
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* GCC note */}
            <div className="mt-5 flex items-center gap-2.5 px-4 py-3 bg-[#f5f5f7] rounded-sm">
              <Zap size={13} className="text-[#86868b] shrink-0" />
              <p className="text-[12px] text-[#555]">
                <span className="font-semibold">GCC region pricing.</span> All prices shown with exclusive GCC discounts. Activation within 7 days. Single invoice per order.
              </p>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-60 xl:w-64 shrink-0 hidden lg:block sticky top-28 space-y-6">

            {/* Trending / Hot products carousel */}
            {trendingProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingUp size={12} className="text-[#ea580c]" />
                  <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em]">Trending Now</p>
                </div>
                <div className="relative overflow-hidden border border-black/8 rounded-sm bg-white">
                  {trendingProducts.map((tp, i) => (
                    <Link key={tp.id} href={`/software/product/${tp.slug}`}
                      className={`block p-4 transition-all duration-500 ${i === trendingIdx ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-sm bg-[#f5f5f7] border border-black/8 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-black">{tp.logo}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-black truncate">{tp.name}</p>
                          <p className="text-[10px] text-[#86868b] truncate">{tp.vendor}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#555] line-clamp-2 leading-snug mb-2">{tp.tagline}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-black">
                          {tp.gcPrice === 0 ? 'Free' : `$${tp.gcPrice}/mo`}
                        </span>
                        <span className="text-[10px] font-semibold text-[#007AFF] flex items-center gap-0.5">
                          View <ArrowRight size={9} />
                        </span>
                      </div>
                    </Link>
                  ))}
                  {/* Dot indicators */}
                  <div className="flex items-center justify-center gap-1 pb-2 pt-1">
                    {trendingProducts.map((_, i) => (
                      <button key={i} onClick={() => setTrendingIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === trendingIdx ? 'bg-[#007AFF] w-3' : 'bg-black/15'}`} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {relatedBundles.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-3">Buy as a Bundle</p>
              <div className="space-y-3">
                {relatedBundles.slice(0, 3).map(bundle => (
                  <div key={bundle.id} className="border border-black/8 rounded-sm p-4 bg-white hover:border-black/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-semibold text-black">{bundle.name}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
                        style={{ backgroundColor: bundle.color + '18', color: bundle.color }}>
                        Save {bundle.savePct}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#86868b] mb-2 leading-snug">{bundle.tagline}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-[16px] font-semibold text-black">${bundle.monthlyPrice}</span>
                      <span className="text-[10px] text-[#86868b]">/mo</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {bundle.items.slice(0, 3).map(item => (
                        <div key={item.product} className="flex items-center gap-1.5 text-[11px] text-[#555]">
                          <CheckCircle size={10} strokeWidth={1.5} style={{ color: bundle.color }} className="shrink-0" />
                          {item.product}
                        </div>
                      ))}
                      {bundle.items.length > 3 && <p className="text-[10px] text-[#86868b] pl-4">+{bundle.items.length - 3} more</p>}
                    </div>
                    <Link href={`/bundles/${bundle.slug}`}
                      className="flex items-center justify-center gap-1 w-full py-2 text-[11px] font-semibold rounded-sm text-white transition-colors min-h-[36px]"
                      style={{ backgroundColor: bundle.color }}>
                      <Package size={11} /> View Bundle
                    </Link>
                  </div>
                ))}
              </div>

              {/* Other categories */}
              <div className="mt-6">
                <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-2.5">Other Categories</p>
                {softwareCategories.filter(c => c.slug !== slug && c.featured).slice(0, 5).map(c => (
                  <Link key={c.slug} href={`/software/category/${c.slug}`}
                    className="flex items-center justify-between py-2 text-[12px] text-[#555] hover:text-black border-b border-black/5 group">
                    <span className="group-hover:text-[#007AFF] transition-colors">{c.name}</span>
                    <span className="text-[10px] text-[#86868b]">{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
