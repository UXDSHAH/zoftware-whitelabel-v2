'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star, Check, Globe, Users, Calendar, ExternalLink, Building2, Mail, MapPin, CalendarDays, ChevronRight } from 'lucide-react';
import type { Product } from '@/data/products';
import { getAlternatives } from '@/data/products';

const TABS = ['Overview', 'Features', 'Pricing', 'Reviews', 'Alternatives'] as const;
type Tab = typeof TABS[number];

function StarFill({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? '#007AFF' : 'none'} className={i <= Math.round(rating) ? 'text-accent' : 'text-[#e5e5e7]'} />
      ))}
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[12px] text-[#555555] w-32 shrink-0">{label}</p>
      <div className="flex-1 bg-surface rounded-full h-1.5">
        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <p className="text-[12px] font-semibold text-black w-5 text-right shrink-0">{value}</p>
    </div>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const aedRate = 3.67;
  const alternatives = getAlternatives(product.alternatives);

  const priceDisplay = product.startingPrice === 0 ? 'Free' : `$${product.startingPrice}`;

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-24">

      {/* Breadcrumb */}
      <div className="border-b border-black/8 bg-[#f9fafb]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 overflow-x-auto">
          <Link href="/products" className="flex items-center gap-1 text-[12px] text-muted hover:text-black transition-colors shrink-0">
            <ArrowLeft size={11} /> All Software
          </Link>
          <ChevronRight size={10} className="text-[#c7c7cc] shrink-0" />
          <Link href={`/products?category=${product.categorySlug}`} className="text-[12px] text-muted hover:text-black transition-colors shrink-0">{product.category}</Link>
          <ChevronRight size={10} className="text-[#c7c7cc] shrink-0" />
          <span className="text-[12px] text-black font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Product Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-sm bg-surface border border-black/8 flex items-center justify-center shrink-0">
            <span className="text-[13px] font-bold text-black">{product.logo}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-[22px] sm:text-[28px] font-semibold text-black tracking-tight leading-tight">{product.name}</h1>
              {product.isNew && <span className="bg-[#dbeafe] text-accent text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">New</span>}
            </div>
            <p className="text-[13px] text-muted mb-2">by {product.vendor} · {product.category} · {product.deployment}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <StarFill rating={product.rating} />
              <span className="text-[13px] font-semibold text-black">{product.rating}</span>
              <span className="text-[12px] text-muted">({product.reviews.toLocaleString()} reviews)</span>
              {product.fitScore && (
                <span className="bg-[#dcfce7] text-[#16a34a] text-[10px] font-semibold px-2 py-0.5 rounded-full">{product.fitScore}% match</span>
              )}
            </div>
          </div>
          {/* Desktop CTAs in header */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link href={`/checkout?slug=${product.slug}&plan=${product.plans[0]?.name}&price=${product.plans[0]?.price}`}
              className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 text-[13px] font-medium rounded-sm hover:bg-accent-hover transition-colors">
              Buy Now <ArrowRight size={13} strokeWidth={2} />
            </Link>
            <Link href="/sign-in" className="flex items-center gap-2 border border-black/10 bg-white text-black px-4 py-2.5 text-[13px] font-medium rounded-sm hover:bg-surface transition-colors">
              <Calendar size={13} /> Schedule Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Tab Nav */}
      <div className="sticky top-14 z-30 bg-white border-b border-black/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide -mb-px">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8">
        <div className="flex gap-8 items-start">

          {/* Left — tab content */}
          <div className="flex-1 min-w-0">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                {/* Elevator Pitch */}
                <div className="bg-[#f9fafb] border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">About {product.name}</p>
                  <p className="text-[14px] text-[#333333] leading-[1.75]">{product.overview}</p>
                </div>

                {/* USP */}
                <div className="border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">What makes it different</p>
                  <p className="text-[14px] text-[#333333] leading-[1.75]">{product.usp}</p>
                </div>

                {/* Product Details Card */}
                <div className="border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">Product Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: <Building2 size={13} />, label: 'Vendor', value: product.vendor },
                      { icon: <MapPin size={13} />, label: 'Headquarters', value: product.hqLocation },
                      { icon: <CalendarDays size={13} />, label: 'Year Founded', value: String(product.yearFounded) },
                      { icon: <Globe size={13} />, label: 'Deployment', value: product.deployment },
                      { icon: <Users size={13} />, label: 'Best For', value: product.targetSize.join(', ') },
                      { icon: <Mail size={13} />, label: 'Support Email', value: product.supportEmail },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2.5">
                        <span className="text-muted mt-0.5 shrink-0">{icon}</span>
                        <div>
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.05em]">{label}</p>
                          <p className="text-[13px] text-black font-medium mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href={product.website} target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1.5 text-[12px] text-accent hover:text-accent-hover transition-colors font-medium">
                    <ExternalLink size={11} /> Visit {product.vendor} website
                  </a>
                </div>

                {/* Feature Highlights */}
                <div className="border border-black/8 rounded-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em]">Key Features</p>
                    <button onClick={() => setActiveTab('Features')} className="text-[11px] font-semibold text-accent hover:text-accent-hover transition-colors">
                      See all features →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.slice(0, 8).map(f => (
                      <div key={f} className="flex items-center gap-2.5 bg-[#f9fafb] border border-black/8 rounded-sm px-3 py-2">
                        <div className="w-4 h-4 rounded-sm bg-accent flex items-center justify-center shrink-0">
                          <Check size={9} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[12px] text-black font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ratings Overview */}
                <div className="border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">Ratings Breakdown</p>
                  <div className="space-y-3">
                    <RatingBar label="Ease of Use" value={product.ratings.easeOfUse} />
                    <RatingBar label="Value for Money" value={product.ratings.valueForMoney} />
                    <RatingBar label="Customer Support" value={product.ratings.customerSupport} />
                    <RatingBar label="Features" value={product.ratings.features} />
                    <RatingBar label="Implementation" value={product.ratings.implementation} />
                  </div>
                  <button onClick={() => setActiveTab('Reviews')} className="mt-4 text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors">
                    Read all {product.reviews.toLocaleString()} reviews →
                  </button>
                </div>
              </div>
            )}

            {/* ── FEATURES TAB ── */}
            {activeTab === 'Features' && (
              <div className="space-y-6">
                <div className="border border-black/8 rounded-sm p-5">
                  <div className="flex gap-6 mb-6 flex-wrap">
                    <div>
                      <p className="text-[32px] font-medium text-accent leading-none">{product.features.length}</p>
                      <p className="text-[12px] text-muted mt-1">Features</p>
                    </div>
                    <div>
                      <p className="text-[32px] font-medium text-accent leading-none">{product.ratings.features.toFixed(1)}</p>
                      <p className="text-[12px] text-muted mt-1">Feature Rating</p>
                    </div>
                    <div>
                      <p className="text-[32px] font-medium text-accent leading-none">{product.reviews.toLocaleString()}</p>
                      <p className="text-[12px] text-muted mt-1">Verified Reviews</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">All Features</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map(f => (
                      <div key={f} className="flex items-center gap-2.5 py-2 px-3 bg-[#f9fafb] border border-black/8 rounded-sm">
                        <div className="w-4 h-4 rounded-sm bg-accent flex items-center justify-center shrink-0">
                          <Check size={9} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[12px] text-black font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PRICING TAB ── */}
            {activeTab === 'Pricing' && (
              <div className="space-y-6">
                {/* Pricing Overview */}
                <div className="bg-[#f9fafb] border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">Pricing Overview</p>
                  <p className="text-[14px] text-[#333333] leading-[1.75]">{product.pricingOverview}</p>
                </div>

                {/* Plans */}
                <div>
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">{product.name} Pricing Plans</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.plans.map((plan, i) => (
                      <div key={plan.name} className={`border rounded-sm p-5 flex flex-col ${i === 1 ? 'border-accent bg-[#EBF1FD]' : 'border-black/8 bg-white'}`}>
                        {i === 1 && <span className="inline-block bg-accent text-white text-[9px] font-semibold px-2 py-0.5 rounded-full mb-2 w-fit">Most Popular</span>}
                        <p className="text-[15px] font-semibold text-black mb-1">{plan.name}</p>
                        <div className="mb-1">
                          <span className="text-[30px] font-medium text-black tracking-tight leading-tight">
                            {plan.price === 0 ? 'Free' : `$${plan.price}`}
                          </span>
                          {plan.price > 0 && <span className="text-[12px] text-muted ml-1">/{plan.billing}</span>}
                        </div>
                        {plan.price > 0 && (
                          <p className="text-[11px] text-muted mb-4">≈ AED {Math.round(plan.price * aedRate)}/mo</p>
                        )}
                        <div className="space-y-2 mb-5 flex-1">
                          {plan.features.map(f => (
                            <div key={f} className="flex items-start gap-2">
                              <Check size={11} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                              <span className="text-[12px] text-[#333333]">{f}</span>
                            </div>
                          ))}
                        </div>
                        <Link
                          href={`/checkout?slug=${product.slug}&plan=${encodeURIComponent(plan.name)}&price=${plan.price}&billing=${encodeURIComponent(plan.billing)}`}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium rounded-sm transition-colors ${i === 1 ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-white text-black border border-black/10 hover:bg-surface'}`}
                        >
                          {plan.price === 0 ? 'Get Started Free' : 'Buy Now'} <ArrowRight size={13} strokeWidth={2} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── REVIEWS TAB ── */}
            {activeTab === 'Reviews' && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="border border-black/8 rounded-sm p-5">
                  <div className="flex items-start gap-6 flex-wrap">
                    <div className="text-center">
                      <p className="text-[52px] font-medium text-black leading-none">{product.rating}</p>
                      <StarFill rating={product.rating} size={14} />
                      <p className="text-[11px] text-muted mt-1">{product.reviews.toLocaleString()} reviews</p>
                    </div>
                    <div className="flex-1 min-w-[200px] space-y-3 pt-1">
                      <RatingBar label="Ease of Use" value={product.ratings.easeOfUse} />
                      <RatingBar label="Value for Money" value={product.ratings.valueForMoney} />
                      <RatingBar label="Customer Support" value={product.ratings.customerSupport} />
                      <RatingBar label="Features" value={product.ratings.features} />
                      <RatingBar label="Implementation" value={product.ratings.implementation} />
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {product.reviewsList.map(review => (
                    <div key={review.id} className="border border-black/8 rounded-sm p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="text-[13px] font-semibold text-black">{review.author}</p>
                          <p className="text-[11px] text-muted">{review.role}, {review.company}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <StarFill rating={review.rating} />
                          <p className="text-[11px] text-muted mt-0.5">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-[13px] font-semibold text-black mb-1.5">{review.title}</p>
                      <p className="text-[13px] text-[#555555] leading-[1.65]">{review.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ALTERNATIVES TAB ── */}
            {activeTab === 'Alternatives' && (
              <div className="space-y-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">Alternatives to {product.name}</p>
                {alternatives.map(alt => (
                  <Link key={alt.id} href={`/products/${alt.slug}`}
                    className="flex items-start gap-4 border border-black/8 rounded-sm p-5 hover:border-black/20 hover:bg-[#f9fafb] transition-all block">
                    <div className="w-12 h-12 rounded-sm bg-surface border border-black/8 flex items-center justify-center shrink-0">
                      <span className="text-[12px] font-bold text-black">{alt.logo}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-[14px] font-semibold text-black">{alt.name}</p>
                        <span className="bg-surface text-muted text-[10px] px-2 py-0.5 rounded-sm">{alt.category}</span>
                        {alt.fitScore && <span className="bg-[#dcfce7] text-[#16a34a] text-[10px] font-semibold px-1.5 py-0.5 rounded-full">{alt.fitScore}% match</span>}
                      </div>
                      <p className="text-[12px] text-[#555555] mb-2 line-clamp-2">{alt.tagline}</p>
                      <div className="flex items-center gap-3">
                        <StarFill rating={alt.rating} />
                        <span className="text-[11px] text-muted">{alt.rating} ({alt.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-semibold text-black">{alt.startingPrice === 0 ? 'Free' : `$${alt.startingPrice}`}</p>
                      {alt.startingPrice > 0 && <p className="text-[10px] text-muted">/{alt.billingCycle}</p>}
                      <span className="text-[11px] text-accent font-medium mt-2 flex items-center gap-0.5 justify-end">View <ArrowRight size={10} /></span>
                    </div>
                  </Link>
                ))}
                <Link href="/compare" className="flex items-center justify-center gap-2 border border-black/10 rounded-sm py-3 text-[13px] font-medium text-accent hover:bg-surface transition-colors">
                  Compare all {product.category} tools side-by-side <ArrowRight size={13} />
                </Link>
              </div>
            )}

          </div>

          {/* Right Sidebar — desktop only */}
          <div className="w-60 xl:w-64 shrink-0 hidden lg:block">
            <div className="sticky top-28 space-y-3">

              {/* Buy card */}
              <div className="border border-black/8 rounded-sm p-5">
                <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2">Starting from</p>
                <p className="text-[30px] font-medium text-black tracking-tight leading-none mb-0.5">{priceDisplay}</p>
                {product.startingPrice > 0 && (
                  <>
                    <p className="text-[12px] text-muted mb-0.5">per {product.billingCycle}</p>
                    <p className="text-[11px] text-muted mb-4">≈ AED {Math.round(product.startingPrice * aedRate)}/mo</p>
                  </>
                )}
                <div className="space-y-2 mt-4">
                  <Link href={`/checkout?slug=${product.slug}&plan=${product.plans[0]?.name}&price=${product.plans[0]?.price}`}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-white py-2.5 text-[13px] font-medium rounded-sm hover:bg-accent-hover transition-colors">
                    Buy Now <ArrowRight size={13} strokeWidth={2} />
                  </Link>
                  <Link href="/sign-in" className="w-full flex items-center justify-center gap-2 bg-white text-black border border-black/10 py-2.5 text-[13px] font-medium rounded-sm hover:bg-surface transition-colors">
                    <Calendar size={13} strokeWidth={1.5} /> Schedule Demo
                  </Link>
                  <a href={product.website} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1 text-[11px] text-muted hover:text-black transition-colors py-1.5">
                    <ExternalLink size={11} /> Visit Website
                  </a>
                </div>
              </div>

              {/* Quick info */}
              <div className="border border-black/8 rounded-sm p-4 space-y-3">
                {[
                  { icon: <Globe size={13} />, label: 'Deployment', value: product.deployment },
                  { icon: <Users size={13} />, label: 'Best for', value: product.targetSize.join(', ') },
                  { icon: <MapPin size={13} />, label: 'HQ', value: product.hqLocation },
                  { icon: <CalendarDays size={13} />, label: 'Founded', value: String(product.yearFounded) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className="text-muted mt-0.5 shrink-0">{icon}</span>
                    <div>
                      <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.05em]">{label}</p>
                      <p className="text-[12px] text-black font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compare CTA */}
              <div className="bg-[#f9fafb] border border-black/8 rounded-sm p-4">
                <p className="text-[12px] font-semibold text-black mb-1">Compare alternatives</p>
                <p className="text-[11px] text-muted mb-3">See how {product.name} stacks up against similar tools.</p>
                <Link href="/compare" className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors">
                  Browse {product.category} tools <ArrowRight size={11} />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA Bar — below fold */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/8 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-black truncate">{product.name}</p>
          <p className="text-[11px] text-muted">{priceDisplay}{product.startingPrice > 0 ? `/${product.billingCycle}` : ''}</p>
        </div>
        <Link href="/sign-in" className="flex items-center gap-1.5 border border-black/10 text-black px-3 py-2 text-[12px] font-medium rounded-sm hover:bg-surface transition-colors shrink-0">
          <Calendar size={12} /> Demo
        </Link>
        <Link href={`/checkout?slug=${product.slug}&plan=${product.plans[0]?.name}&price=${product.plans[0]?.price}`}
          className="flex items-center gap-1.5 bg-accent text-white px-4 py-2 text-[12px] font-semibold rounded-sm hover:bg-accent-hover transition-colors shrink-0">
          Buy Now <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>

      {/* Desktop Fixed Bottom Bar — on scroll */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">{product.logo}</span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-white">{product.name}</p>
              <p className="text-[11px] text-white/60">{priceDisplay}{product.startingPrice > 0 ? `/${product.billingCycle}` : ' — Free to start'} · {product.deployment}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="flex items-center gap-2 text-[13px] font-medium text-white/70 border border-white/20 px-4 py-2 rounded-sm hover:text-white hover:border-white/40 transition-colors">
              <Calendar size={13} /> Schedule Demo
            </Link>
            <Link href={`/checkout?slug=${product.slug}&plan=${product.plans[0]?.name}&price=${product.plans[0]?.price}`}
              className="flex items-center gap-2 bg-accent text-white px-5 py-2 text-[13px] font-semibold rounded-sm hover:bg-accent-hover transition-colors">
              Buy Now <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
