'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Star, Check, Globe, Users, Calendar, ExternalLink,
  Building2, Mail, MapPin, ChevronRight, Shield, Clock, Zap, Package, CheckCircle
} from 'lucide-react';
import { getGatewayProductBySlug, GatewayProduct } from '@/data/gateway-products';
import { getCatalogBySlug } from '@/data/products-catalog';
import { bundles } from '@/data/bundles';
import { AED_RATE } from '@/data/billing-options';


const TABS = ['Overview', 'Features', 'Pricing', 'Bundles'] as const;
type Tab = typeof TABS[number];

// Build a synthetic GatewayProduct from catalog data so every product has a detail page
function buildFallbackProduct(slug: string): GatewayProduct | null {
  const cat = getCatalogBySlug(slug);
  if (!cat) return null;
  return {
    id: cat.slug, slug: cat.slug, name: cat.name, vendor: cat.vendor,
    vendorFounded: 2000, vendorHQ: 'Global', vendorWebsite: '#',
    category: cat.category, categorySlug: cat.categorySlug,
    logo: cat.logo, tagline: cat.tagline,
    overview: `${cat.name} by ${cat.vendor} — ${cat.tagline} Used by thousands of businesses across the GCC region.`,
    usp: `${cat.name} is one of the most recognised solutions in ${cat.category}, known for ease of use, reliable performance, and strong customer support.`,
    deployment: 'Cloud', targetSize: ['SME', 'Mid-Market', 'Enterprise'],
    rating: cat.rating, reviews: cat.reviews,
    ratings: { easeOfUse: parseFloat((cat.rating - 0.1).toFixed(1)), valueForMoney: parseFloat((cat.rating - 0.1).toFixed(1)), customerSupport: parseFloat((cat.rating - 0.1).toFixed(1)), features: cat.rating, implementation: parseFloat((cat.rating - 0.1).toFixed(1)) },
    features: cat.tags.map(t => `${t} capabilities`).concat(['Cloud-based deployment', 'Mobile app', 'Email support', 'API access', 'Reporting & analytics', 'User role management']),
    plans: [
      { name: 'Starter', price: cat.gcPrice, billing: 'user/month', features: ['Core features', 'Email support', 'Basic analytics'] },
      { name: 'Professional', price: cat.originalPrice, billing: 'user/month', features: ['All Starter features', 'Priority support', 'Advanced analytics'] },
    ],
    offerCode: `${slug}-gcc`,
    gcPrice: cat.gcPrice, originalPrice: cat.originalPrice, discountPct: cat.discountPct,
    activationDays: 7, integrations: ['Zapier', 'Google Workspace', 'Slack', 'Microsoft 365'],
    tags: cat.tags, alternatives: [], supportEmail: `support@${slug}.com`,
    website: `https://www.${slug}.com`, yearFounded: 2000,
  };
}

function StarFill({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? 'var(--color-accent)' : 'none'}
          className={i <= Math.round(rating) ? 'text-accent' : 'text-[#e5e5e7]'} />
      ))}
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[12px] text-[#555] w-32 shrink-0">{label}</p>
      <div className="flex-1 bg-surface rounded-full h-1.5">
        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <p className="text-[12px] font-semibold text-black w-5 text-right">{value}</p>
    </div>
  );
}

export default function GatewayProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  // Try gateway products first (full data), then fall back to catalog-derived page
  const product = getGatewayProductBySlug(slug) || buildFallbackProduct(slug);
  if (!product) return notFound();

  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'AED'>('USD');

  const multiplier = billingCycle === 'annual' ? 0.8 : 1;
  const gcPrice = product.gcPrice * multiplier;
  const originalPrice = product.originalPrice * multiplier;

  const fmt = (p: number) => currency === 'AED' ? `AED ${Math.round(p * AED_RATE)}` : `$${p.toFixed(2)}`;

  const relatedBundles = bundles.filter(b =>
    b.items.some(item => item.product === product.name || item.offerCode === product.offerCode)
  );

  const checkoutUrl = `/checkout?product=${encodeURIComponent(product.name)}&plan=${encodeURIComponent(product.plans[product.plans.length - 1]?.name || 'Standard')}&price=${gcPrice.toFixed(2)}&billing=${billingCycle}&offerCode=${product.offerCode}&currency=${currency}`;

  return (
    <div className="bg-white min-h-screen pb-24">

      {/* Breadcrumb */}
      <div className="border-b border-black/8 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 overflow-x-auto">
          <Link href="/software" className="flex items-center gap-1 text-[12px] text-muted hover:text-black transition-colors shrink-0">
            <ArrowLeft size={11} /> Software Gateway
          </Link>
          <ChevronRight size={10} className="text-[#c7c7cc] shrink-0" />
          <Link href={`/software/category/${product.categorySlug}`}
            className="text-[12px] text-muted hover:text-black transition-colors shrink-0">{product.category}</Link>
          <ChevronRight size={10} className="text-[#c7c7cc] shrink-0" />
          <span className="text-[12px] text-black font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Product header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-sm bg-surface border border-black/8 flex items-center justify-center shrink-0">
            <span className="text-[13px] font-bold text-black">{product.logo}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-[22px] sm:text-[28px] font-semibold text-black tracking-tight">{product.name}</h1>
              <span className="bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                {product.discountPct}% off — GCC
              </span>
            </div>
            <p className="text-[13px] text-muted mb-2">by {product.vendor} · {product.category} · {product.deployment}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <StarFill rating={product.rating} />
              <span className="text-[13px] font-semibold text-black">{product.rating}</span>
              <span className="text-[12px] text-muted">({product.reviews.toLocaleString()} reviews on Zoftware)</span>
            </div>
          </div>
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link href={checkoutUrl}
              className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 text-[13px] font-medium rounded-sm hover:bg-accent-hover transition-colors min-h-[44px]">
              Buy Now — {fmt(gcPrice)}/user/mo <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-black/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide -mb-px">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-black'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-7">
        <div className="flex gap-8 items-start">

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* ── OVERVIEW ── */}
            {activeTab === 'Overview' && (
              <div className="space-y-5">
                <div className="bg-white border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">About {product.name}</p>
                  <p className="text-[14px] text-[#333] leading-[1.75]">{product.overview}</p>
                </div>

                <div className="bg-white border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">What makes it different</p>
                  <p className="text-[14px] text-[#333] leading-[1.75]">{product.usp}</p>
                </div>

                <div className="bg-white border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">Product Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: <Building2 size={13} />, label: 'Vendor', value: product.vendor },
                      { icon: <MapPin size={13} />, label: 'Headquarters', value: product.vendorHQ },
                      { icon: <Calendar size={13} />, label: 'Year Founded', value: String(product.yearFounded) },
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

                {/* Key features (first 6) */}
                <div className="bg-white border border-black/8 rounded-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em]">Key Features</p>
                    <button onClick={() => setActiveTab('Features')} className="text-[11px] font-semibold text-accent hover:text-accent-hover">
                      See all →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.slice(0, 6).map(f => (
                      <div key={f} className="flex items-center gap-2.5 bg-white border border-black/8 rounded-sm px-3 py-2">
                        <div className="w-4 h-4 rounded-sm border border-black/10 bg-white flex items-center justify-center shrink-0">
                          <Check size={9} className="text-accent" strokeWidth={2.5} />
                        </div>
                        <span className="text-[12px] text-black font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div className="bg-white border border-black/8 rounded-sm p-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-4">Ratings Breakdown</p>
                  <div className="space-y-3">
                    <RatingBar label="Ease of Use" value={product.ratings.easeOfUse} />
                    <RatingBar label="Value for Money" value={product.ratings.valueForMoney} />
                    <RatingBar label="Customer Support" value={product.ratings.customerSupport} />
                    <RatingBar label="Features" value={product.ratings.features} />
                    <RatingBar label="Implementation" value={product.ratings.implementation} />
                  </div>
                  <p className="text-[11px] text-muted mt-3">Source: Zoftware · {product.reviews.toLocaleString()} verified reviews</p>
                </div>

                {/* Integrations */}
                {product.integrations.length > 0 && (
                  <div className="border border-black/8 rounded-sm p-5">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">Key Integrations</p>
                    <div className="flex flex-wrap gap-2">
                      {product.integrations.map(int => (
                        <span key={int} className="text-[12px] font-medium bg-surface border border-black/8 text-[#333] px-3 py-1.5 rounded-sm">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── FEATURES ── */}
            {activeTab === 'Features' && (
              <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/8 bg-white">
                  <p className="text-[13px] font-semibold text-black">All Features ({product.features.length})</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-none">
                  {product.features.map((f, i) => (
                    <div key={f} className={`flex items-start gap-3 px-5 py-3.5 ${i % 2 === 0 ? 'sm:border-r border-black/5' : ''} border-b border-black/5`}>
                      <div className="w-5 h-5 rounded-sm border border-black/10 bg-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} className="text-accent" strokeWidth={2.5} />
                      </div>
                      <span className="text-[13px] text-black leading-[1.5]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── PRICING ── */}
            {activeTab === 'Pricing' && (
              <div className="space-y-5">
                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 bg-surface p-0.5 rounded-sm">
                    {(['monthly', 'annual'] as const).map(c => (
                      <button key={c} onClick={() => setBillingCycle(c)}
                        className={`px-3 py-1.5 text-[11px] font-medium rounded-sm transition-all ${billingCycle === c ? 'bg-white text-black shadow-sm' : 'text-muted hover:text-black'}`}>
                        {c === 'annual' ? 'Annual (−20%)' : 'Monthly'}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 bg-surface p-0.5 rounded-sm">
                    {(['USD', 'AED'] as const).map(c => (
                      <button key={c} onClick={() => setCurrency(c)}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-sm transition-all ${currency === c ? 'bg-white text-black shadow-sm' : 'text-muted hover:text-black'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GCC special offer card */}
                <div className="bg-white border-2 border-accent rounded-sm p-5">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded-sm">GCC Exclusive Offer</span>
                      <h3 className="text-[18px] font-semibold text-black mt-2">{product.discountPct}% off — Standard Plan</h3>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[28px] font-semibold text-black">{fmt(gcPrice)}</span>
                        <span className="text-[13px] text-muted">/user/mo</span>
                      </div>
                      <p className="text-[12px] text-muted line-through">{fmt(product.originalPrice * multiplier)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] text-[#555]">
                    <div className="flex items-center gap-1.5"><Clock size={11} className="text-muted" /> Activates in {product.activationDays} days</div>
                    <div className="flex items-center gap-1.5"><Shield size={11} className="text-muted" /> GCC-licensed · Single invoice</div>
                    <div className="flex items-center gap-1.5"><Zap size={11} className="text-muted" /> Offer code: {product.offerCode}</div>
                    <div className="flex items-center gap-1.5"><Users size={11} className="text-muted" /> Min 1 user · Unlimited max</div>
                  </div>
                  <Link href={checkoutUrl}
                    className="flex items-center justify-center gap-2 w-full bg-accent text-white py-3 text-[14px] font-semibold rounded-sm hover:bg-accent-hover transition-colors min-h-[44px]">
                    Buy Now — {fmt(gcPrice)}/user/mo <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                </div>

                {/* Standard vendor plans */}
                <div>
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Standard Vendor Plans</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.plans.map(plan => (
                      <div key={plan.name} className="bg-white border border-black/8 rounded-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[14px] font-semibold text-black">{plan.name}</p>
                          <div className="text-right">
                            <p className="text-[14px] font-semibold text-black">
                              {plan.price === 0 ? 'Free' : fmt(plan.price * multiplier)}
                            </p>
                            {plan.price > 0 && <p className="text-[10px] text-muted">/{plan.billing}</p>}
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {plan.features.map(f => (
                            <li key={f} className="flex items-start gap-2 text-[12px] text-[#555]">
                              <Check size={11} className="text-accent shrink-0 mt-0.5" strokeWidth={2} /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted mt-3">* GCC pricing may differ from vendor list prices. Our GCC offer gives you the best available rate.</p>
                </div>
              </div>
            )}

            {/* ── BUNDLES ── */}
            {activeTab === 'Bundles' && (
              <div className="space-y-4">
                <p className="text-[14px] text-[#555] leading-[1.65]">
                  {product.name} is included in the following software bundles — save up to 40% by buying as a package.
                </p>
                {relatedBundles.length === 0 ? (
                  <div className="border border-black/8 rounded-sm p-6 text-center text-[13px] text-muted">
                    No bundle includes this product yet. <Link href="/software?view=bundles" className="text-accent">Browse all bundles →</Link>
                  </div>
                ) : (
                  relatedBundles.map(bundle => (
                    <div key={bundle.id} className="bg-white border border-black/8 rounded-sm overflow-hidden hover:border-black/20 transition-all">
                      <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
                            style={{ backgroundColor: bundle.color + '18', color: bundle.color }}>
                            <Package size={18} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-black">{bundle.name}</p>
                            <p className="text-[11px] text-muted">{bundle.targetSize} · {bundle.items.length} products included</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-[18px] font-semibold text-black">${bundle.monthlyPrice}<span className="text-[12px] text-muted font-normal">/mo</span></p>
                            <p className="text-[11px] text-muted line-through">${bundle.originalMonthlyPrice}/mo</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
                            style={{ backgroundColor: bundle.color + '18', color: bundle.color }}>
                            Save {bundle.savePct}%
                          </span>
                        </div>
                      </div>
                      <div className="px-5 pb-4 flex items-center justify-between gap-3 border-t border-black/5">
                        <div className="flex flex-wrap gap-1">
                          {bundle.items.slice(0, 4).map(item => (
                            <span key={item.product} className="text-[10px] bg-surface text-[#555] px-2 py-0.5 rounded-sm">{item.product}</span>
                          ))}
                        </div>
                        <Link href={`/bundles/${bundle.slug}`}
                          className="flex items-center gap-1 text-[12px] font-semibold transition-colors shrink-0 min-h-[44px] items-center"
                          style={{ color: bundle.color }}>
                          View Bundle <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
                <Link href="/software?view=bundles"
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
                  Browse all bundles <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-28">
            <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
              <div className="p-5 border-b border-black/8">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em]">GCC Price</p>
                  <span className="text-[10px] font-bold text-[#16a34a] bg-[#dcfce7] px-1.5 py-0.5 rounded-sm">{product.discountPct}% off</span>
                </div>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-[26px] font-semibold text-black">{fmt(gcPrice)}</span>
                  <span className="text-[12px] text-muted">/user/mo</span>
                </div>
                <p className="text-[11px] text-muted line-through mb-3">{fmt(originalPrice)}/user/mo</p>
                <Link href={checkoutUrl}
                  className="flex items-center justify-center gap-2 w-full bg-accent text-white py-2.5 text-[13px] font-semibold rounded-sm hover:bg-accent-hover transition-colors min-h-[44px]">
                  Buy Now <ArrowRight size={13} strokeWidth={2} />
                </Link>
              </div>
              <div className="p-4 space-y-2.5">
                {[
                  { icon: <Clock size={12} />, text: `Activates in ${product.activationDays} days` },
                  { icon: <Shield size={12} />, text: 'GCC-licensed · Single invoice' },
                  { icon: <Users size={12} />, text: product.targetSize.join(' · ') },
                  { icon: <Zap size={12} />, text: `${product.reviews.toLocaleString()} verified reviews` },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[11px] text-muted">{icon} {text}</div>
                ))}
              </div>
            </div>

            {/* Related bundles */}
            {relatedBundles.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-2.5">Save more in a bundle</p>
                {relatedBundles.slice(0, 2).map(b => (
                  <Link key={b.id} href={`/bundles/${b.slug}`}
                    className="flex items-center gap-3 border border-black/8 rounded-sm p-3.5 mb-2.5 hover:border-black/20 hover:bg-surface transition-all">
                    <Package size={15} strokeWidth={1.5} style={{ color: b.color }} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-black">{b.name}</p>
                      <p className="text-[10px] text-muted">Save {b.savePct}% · ${b.monthlyPrice}/mo</p>
                    </div>
                    <ChevronRight size={12} className="text-muted shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky buy */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-semibold text-white">{fmt(gcPrice)}<span className="text-[11px] text-white/60 font-normal">/user/mo</span></p>
            <p className="text-[10px] text-[#16a34a] font-semibold">{product.discountPct}% off — GCC exclusive</p>
          </div>
          <Link href={checkoutUrl}
            className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 text-[13px] font-semibold rounded-sm hover:bg-accent-hover transition-colors min-h-[44px]">
            Buy Now <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>

      
    </div>
  );
}
