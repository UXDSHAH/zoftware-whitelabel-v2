'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, CheckCircle, Package, Zap,
  ChevronRight, Shield, Clock, Users, Info, X, ExternalLink
} from 'lucide-react';
import { getBundleBySlug, bundles } from '@/data/bundles';
import { AED_RATE } from '@/data/billing-options';

// ── Product info lookup ────────────────────────────────────────────────────
const productInfo: Record<string, {
  slug: string;
  description: string;
  features: string[];
  usedFor: string;
}> = {
  'Freshchat': {
    slug: 'freshchat',
    usedFor: 'Customer messaging & live chat',
    description: 'AI-powered live chat and messaging platform that lets your team support customers across web, mobile, WhatsApp, and social channels from a single inbox.',
    features: ['Real-time chat widget for web & mobile', 'Freddy AI bot for 24/7 automated support', 'WhatsApp & social channel integration', 'Team inbox with assignment rules', 'Conversation analytics & CSAT scores'],
  },
  'Freshcaller': {
    slug: 'freshcaller',
    usedFor: 'Cloud business phone & calling',
    description: 'Cloud-based business phone system with virtual numbers, IVR call routing, and real-time analytics — no hardware required, deploy in hours.',
    features: ['Virtual numbers in 90+ countries', 'IVR & smart call routing', 'Call recording & voicemail', 'Live call monitoring dashboard', 'CRM & helpdesk integration'],
  },
  'Zoho Mail': {
    slug: 'zoho-mail',
    usedFor: 'Business email with custom domain',
    description: 'Professional business email hosting with custom domain, shared team inboxes, and robust admin controls — built for organisations that need reliability and compliance.',
    features: ['Custom domain email (yourname@company.com)', 'Shared team inboxes & distribution lists', 'eDiscovery & audit trails', 'Calendar, contacts & tasks built in', 'Admin console with security controls'],
  },
  'Spotler Mail+': {
    slug: 'spotler-mail',
    usedFor: 'Email marketing & automation',
    description: 'Drag-and-drop email marketing platform with automation workflows, A/B testing, and detailed campaign analytics to grow and retain your customer base.',
    features: ['Drag-and-drop email builder', 'Automation workflows & drip campaigns', 'A/B testing & send-time optimisation', 'Campaign analytics & heatmaps', 'GDPR & GCC-compliant delivery'],
  },
  'Freshsales': {
    slug: 'freshsales',
    usedFor: 'CRM & sales pipeline',
    description: 'AI-powered CRM with built-in phone, email, activity capture, and visual deal pipeline — helps sales teams close more deals with less manual work.',
    features: ['AI lead scoring (Freddy AI)', 'Visual sales pipeline & deal stages', 'Built-in email & phone calling', 'Sales forecasting & reports', 'Mobile CRM app for on-the-go teams'],
  },
  'Freshservice': {
    slug: 'freshservice',
    usedFor: 'IT service management (ITSM)',
    description: 'ITIL-aligned IT service management platform covering ticketing, asset management, change management, and a self-service portal for your IT team.',
    features: ['Incident & service request ticketing', 'IT asset discovery & management', 'Change & problem management', 'Service catalog & self-service portal', 'SLA policies & escalation rules'],
  },
  'Freshworks': {
    slug: 'freshworks-enterprise',
    usedFor: 'Unified enterprise suite',
    description: 'The complete Freshworks enterprise platform combining CRM, ITSM, customer support, chat, and calling under one roof — with a single admin console and unified reporting.',
    features: ['Unified dashboard across all products', 'Cross-product AI with Freddy AI', 'Enterprise SSO & security controls', 'Advanced analytics & custom reports', 'Dedicated customer success manager'],
  },
  'Freshdesk': {
    slug: 'freshdesk',
    usedFor: 'Omnichannel helpdesk & ticketing',
    description: 'Omnichannel customer support platform with intelligent ticket management, automation rules, SLA tracking, and a knowledge base to help your team resolve issues faster.',
    features: ['Omnichannel inbox (email, chat, phone, social)', 'Smart ticket assignment & automation', 'SLA management & escalations', 'Customer-facing knowledge base', 'Canned responses & collision detection'],
  },
};

export default function BundleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const bundle = getBundleBySlug(slug);
  if (!bundle) return notFound();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'AED'>('USD');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const displayPrice = billingCycle === 'annual' ? bundle.annualMonthlyPrice : bundle.monthlyPrice;
  const displayOriginal = billingCycle === 'annual'
    ? Math.round(bundle.originalMonthlyPrice * 0.8)
    : bundle.originalMonthlyPrice;
  const aedPrice = Math.round(displayPrice * AED_RATE);
  const aedOriginal = Math.round(displayOriginal * AED_RATE);
  const showPrice = currency === 'AED' ? `AED ${aedPrice.toLocaleString()}` : `$${displayPrice}`;
  const showOriginal = currency === 'AED' ? `AED ${aedOriginal.toLocaleString()}` : `$${displayOriginal}`;
  const annualTotal = currency === 'AED'
    ? `AED ${(aedPrice * 12).toLocaleString()}`
    : `$${(displayPrice * 12).toLocaleString()}`;

  const otherBundles = bundles.filter(b => b.slug !== slug);

  return (
    <div className="min-h-screen bg-white pb-28">

      {/* Breadcrumb */}
      <div className="border-b border-black/8 bg-[#f9fafb]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 overflow-x-auto">
          <Link href="/software?view=bundles" className="flex items-center gap-1 text-[12px] text-[#86868b] hover:text-black transition-colors shrink-0">
            <ArrowLeft size={11} /> All Bundles
          </Link>
          <ChevronRight size={10} className="text-[#c7c7cc] shrink-0" />
          <span className="text-[12px] text-black font-medium truncate">{bundle.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-7 sm:pt-10 pb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-sm flex items-center justify-center shrink-0"
            style={{ backgroundColor: bundle.color + '18', color: bundle.color }}>
            <Package size={24} strokeWidth={1.5} />
          </div>
          <div>
            {bundle.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2 inline-block"
                style={{ backgroundColor: bundle.color + '18', color: bundle.color }}>
                {bundle.badge}
              </span>
            )}
            <h1 className="text-[26px] sm:text-[34px] font-semibold text-black tracking-tight">{bundle.name}</h1>
            <p className="text-[14px] text-[#86868b] mt-0.5">{bundle.targetSize} · GCC Region · Activate in {bundle.activationDays} days</p>
          </div>
        </div>
        <p className="text-[15px] text-[#555] leading-[1.65] max-w-[600px]">{bundle.description}</p>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex gap-8 items-start flex-col lg:flex-row">

          {/* Left — bundle detail */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Billing + currency controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-[#f5f5f7] p-0.5 rounded-sm">
                {(['monthly', 'annual'] as const).map(c => (
                  <button key={c} onClick={() => setBillingCycle(c)}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-sm transition-all ${billingCycle === c ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}>
                    {c === 'annual' ? 'Annual (save 20%)' : 'Monthly'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-[#f5f5f7] p-0.5 rounded-sm">
                {(['USD', 'AED'] as const).map(c => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 text-[11px] font-semibold rounded-sm transition-all ${currency === c ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Products in bundle */}
            <div className="border border-black/8 rounded-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb] flex items-center justify-between">
                <p className="text-[13px] font-semibold text-black">Included Software ({bundle.items.length} products)</p>
                <span className="text-[11px] text-[#86868b]">All GCC-licensed</span>
              </div>
              <div className="divide-y divide-black/5">
                {bundle.items.map(item => {
                  const adjustedBundle = billingCycle === 'annual' ? item.bundlePrice * 0.8 : item.bundlePrice;
                  const adjustedOriginal = billingCycle === 'annual' ? item.originalPrice * 0.8 : item.originalPrice;
                  const bPrice = currency === 'AED' ? `AED ${Math.round(adjustedBundle * AED_RATE)}` : `$${adjustedBundle.toFixed(2)}`;
                  const oPrice = currency === 'AED' ? `AED ${Math.round(adjustedOriginal * AED_RATE)}` : `$${adjustedOriginal.toFixed(2)}`;
                  const saving = Math.round(((adjustedOriginal - adjustedBundle) / adjustedOriginal) * 100);
                  const isExpanded = expandedProduct === item.product;
                  const info = productInfo[item.product];
                  return (
                    <div key={item.product}>
                      {/* Product row */}
                      <div className="px-5 py-4 flex items-center justify-between gap-4 bg-white transition-colors"
                        style={{ backgroundColor: isExpanded ? '#f5f9ff' : undefined }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-sm bg-[#f5f5f7] border border-black/8 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-black">{item.product.slice(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-black">{item.product}</p>
                            <p className="text-[11px] text-[#86868b]">{item.vendor} · {item.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className="text-right">
                            <p className="text-[13px] font-semibold text-black">{bPrice}<span className="text-[10px] text-[#86868b] font-normal">/user/mo</span></p>
                            <p className="text-[10px] text-[#86868b] line-through">{oPrice}</p>
                          </div>
                          {saving > 0 && (
                            <span className="text-[9px] font-bold bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded-sm hidden sm:inline">{saving}% off</span>
                          )}
                          {/* Info toggle */}
                          {info && (
                            <button
                              onClick={() => setExpandedProduct(isExpanded ? null : item.product)}
                              title={isExpanded ? 'Hide product info' : 'What does this do?'}
                              className="w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 border"
                              style={{
                                background: isExpanded ? '#007AFF' : 'transparent',
                                borderColor: isExpanded ? '#007AFF' : 'rgba(0,0,0,0.12)',
                                color: isExpanded ? '#fff' : '#86868b',
                              }}>
                              {isExpanded ? <X size={12} strokeWidth={2.5} /> : <Info size={13} strokeWidth={1.8} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable product info panel */}
                      {isExpanded && info && (
                        <div className="px-5 py-4 border-t" style={{ background: '#eef5ff', borderColor: 'rgba(0,122,255,0.12)' }}>
                          {/* Use-case badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
                              style={{ background: 'rgba(0,122,255,0.12)', color: '#007AFF' }}>
                              {info.usedFor}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-[13px] text-[#333] leading-[1.6] mb-3">{info.description}</p>

                          {/* Key features */}
                          <div className="mb-4">
                            <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.08em] mb-2">Key features</p>
                            <ul className="space-y-1.5">
                              {info.features.map(f => (
                                <li key={f} className="flex items-start gap-2 text-[12px] text-[#444]">
                                  <CheckCircle size={12} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#007AFF' }} />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* View full details link */}
                          <Link
                            href={`/software/product/${info.slug}`}
                            className="inline-flex items-center gap-1 text-[12px] font-semibold"
                            style={{ color: '#007AFF' }}>
                            View full product details <ExternalLink size={11} />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highlights */}
            <div className="border border-black/8 rounded-sm p-5">
              <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-3">What&apos;s included</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bundle.highlights.map(h => (
                  <div key={h} className="flex items-start gap-2 text-[13px] text-black">
                    <CheckCircle size={14} strokeWidth={1.5} style={{ color: bundle.color }} className="shrink-0 mt-0.5" />
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Other bundles */}
            <div>
              <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-3">Other Bundles</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherBundles.map(b => (
                  <Link key={b.id} href={`/bundles/${b.slug}`}
                    className="flex items-center gap-3 border border-black/8 rounded-sm p-4 hover:border-black/20 hover:bg-[#f9fafb] transition-all">
                    <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                      style={{ backgroundColor: b.color + '18', color: b.color }}>
                      <Package size={16} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-black">{b.name}</p>
                      <p className="text-[11px] text-[#86868b]">{b.targetSize} · from ${b.monthlyPrice}/mo</p>
                    </div>
                    <ChevronRight size={14} className="text-[#86868b] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right — pricing card */}
          <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
            <div className="border border-black/8 rounded-sm overflow-hidden">
              {/* Pricing header */}
              <div className="p-5 border-b border-black/8">
                <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-3">Bundle Price</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[32px] font-semibold text-black">{showPrice}</span>
                  <span className="text-[13px] text-[#86868b]">/mo</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] text-[#86868b] line-through">{showOriginal}/mo</span>
                  <span className="text-[11px] font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-sm">
                    Save {bundle.savePct}%
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-[#007AFF] font-medium">Billed as {annualTotal}/year</p>
                )}
              </div>

              {/* Trust signals */}
              <div className="px-5 py-4 border-b border-black/8 space-y-2.5">
                {[
                  { icon: <Clock size={13} />, text: `Activates in ${bundle.activationDays} days` },
                  { icon: <Users size={13} />, text: bundle.targetSize },
                  { icon: <Shield size={13} />, text: 'Single invoice · GCC licensed' },
                  { icon: <Zap size={13} />, text: `${bundle.items.length} products included` },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[12px] text-[#555]">
                    <span className="text-[#86868b]">{icon}</span> {text}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="p-5 space-y-2.5">
                <Link
                  href={`/checkout?bundle=${bundle.slug}&price=${displayPrice}&billing=${billingCycle}&currency=${currency}&bundleName=${encodeURIComponent(bundle.name)}`}
                  className="flex items-center justify-center gap-2 w-full py-3 text-[14px] font-semibold rounded-sm text-white transition-colors min-h-[44px]"
                  style={{ backgroundColor: bundle.color }}>
                  Buy Bundle <ArrowRight size={14} strokeWidth={2} />
                </Link>
                <Link href="/software?view=bundles"
                  className="flex items-center justify-center gap-1 w-full py-2.5 text-[12px] font-medium border border-black/10 text-black rounded-sm hover:bg-[#f5f5f7] transition-colors min-h-[44px]">
                  Compare all bundles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-semibold text-white">{showPrice}<span className="text-[11px] text-white/60 font-normal">/mo</span></p>
            <p className="text-[11px] text-white/50 line-through">{showOriginal}/mo</p>
          </div>
          <Link
            href={`/checkout?bundle=${bundle.slug}&price=${displayPrice}&billing=${billingCycle}&currency=${currency}&bundleName=${encodeURIComponent(bundle.name)}`}
            className="flex items-center gap-2 py-2.5 px-5 text-[13px] font-semibold rounded-sm text-white transition-colors min-h-[44px]"
            style={{ backgroundColor: bundle.color }}>
            Buy Bundle <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
