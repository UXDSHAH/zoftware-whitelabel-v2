'use client';

import { useState, Suspense } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Lock, CreditCard, Building2,
  Mail, Phone, ChevronDown, Shield, Package, Zap, Clock, CheckCircle,
  Wrench, Server, MessageSquare, Plus, Minus, X, MapPin, User2
} from 'lucide-react';
import { getProductBySlug } from '@/data/products';
import { getBundleBySlug } from '@/data/bundles';
import { AED_RATE } from '@/data/billing-options';

function mockUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const PROF_SERVICES = [
  { id: 'impl',     label: 'Implementation & Setup',  desc: 'End-to-end deployment, configuration, and go-live support', price: 499 },
  { id: 'training', label: 'Team Training',            desc: 'Live virtual training (up to 20 users, 4 hrs)',             price: 299 },
  { id: 'custom',   label: 'Custom Integration',       desc: 'Connect to your existing ERP, CRM, or data warehouse',      price: 1199 },
];

const MANAGED_SERVICES = [
  { id: 'managed-basic', label: 'Managed Support',  desc: 'Dedicated account manager + 8×5 SLA',         price: 199 },
  { id: 'managed-pro',   label: 'Managed Pro',       desc: '24×7 monitoring, patch management, backups',  price: 349 },
];

type Contact = { name: string; email: string; phone: string; designation: string };

// ── Field component defined at module level so it is never remounted ────────
function Field({ label, value, onChange, placeholder, type = 'text', icon, error, optional = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
  type?: string; icon?: ReactNode; error?: string; optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.06em] mb-1.5">
        {label}{optional && <span className="text-[10px] font-normal ml-1 normal-case">(optional)</span>}
      </label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border bg-surface ${icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5 text-[13px] text-black placeholder-zinc-300 outline-none focus:border-zinc-300 focus:bg-white rounded-lg min-h-[42px] transition-colors ${error ? 'border-red-400' : 'border-black/10'}`}
        />
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const slug          = searchParams.get('slug') || '';
  const planName      = searchParams.get('plan') || '';
  const priceRaw      = searchParams.get('price') || '0';
  const billingParam  = searchParams.get('billing') || 'monthly';
  const productParam  = searchParams.get('product') || '';
  const currencyParam = (searchParams.get('currency') || 'USD') as 'USD' | 'AED';
  const bundleSlug    = searchParams.get('bundle') || '';
  const bundleNameParam = searchParams.get('bundleName') || '';

  const isBundle = !!bundleSlug;
  const bundle   = isBundle ? getBundleBySlug(bundleSlug) : null;
  const product  = slug ? getProductBySlug(slug) : null;
  const basePrice = parseFloat(priceRaw);

  // ── Step 1 state — Plan & Pricing ──────────────────────────────────────
  const [billingCycle, setBillingCycle] = useState<'monthly'|'annual'>(billingParam as 'monthly'|'annual');
  const currency                         = currencyParam;
  const [licenses, setLicenses]         = useState(1);
  const [profSel, setProfSel]           = useState<string[]>([]);
  const [managedSel, setManagedSel]     = useState<string[]>([]);

  const changeLicenses = (d: number) => setLicenses(p => Math.max(1, Math.min(500, p + d)));
  const toggleProf    = (id: string)  => setProfSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleManaged = (id: string)  => setManagedSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const unitPrice         = billingCycle === 'annual' ? Math.round(basePrice * 0.8) : basePrice;
  const licenseMult       = licenses;
  const softwareTotal     = unitPrice * licenseMult;
  const annualSaving      = billingCycle === 'annual' ? Math.round(basePrice * licenseMult * 12 * 0.2) : 0;
  const profTotal         = PROF_SERVICES.filter(s => profSel.includes(s.id)).reduce((a, x) => a + x.price, 0);
  const managedMonthly    = MANAGED_SERVICES.filter(s => managedSel.includes(s.id)).reduce((a, x) => a + x.price, 0);
  const fmt = (usd: number) => currency === 'AED' ? `AED ${Math.round(usd * AED_RATE).toLocaleString()}` : `$${usd.toLocaleString()}`;
  const grandMonthly = softwareTotal + managedMonthly;

  // ── Step 2 state — Payment & Details ───────────────────────────────────
  const [card, setCard]       = useState({ number: '4111 1111 1111 1111', expiry: '12/26', cvv: '123', name: 'Ravi Sharma' });
  const [orderDetails, setOrderDetails] = useState({
    licenseCompany:  '',
    companyLocation: '',
    vatNo:           '',
    contactPerson:   '',
    contactDesignation: '',
  });
  const [sameAddress, setSameAddress] = useState(true);
  const [billing, setBilling]         = useState({ line1: '', city: '', country: 'UAE' });
  const [contacts, setContacts]       = useState<Contact[]>([]);
  const addContact    = () => setContacts(c => [...c, { name: '', email: '', phone: '', designation: '' }]);
  const removeContact = (i: number) => setContacts(c => c.filter((_, j) => j !== i));
  const updateContact = (i: number, field: keyof Contact, val: string) =>
    setContacts(c => c.map((x, j) => j === i ? { ...x, [field]: val } : x));

  // ── Step & validation ──────────────────────────────────────────────────
  const [step, setStep] = useState<'plan'|'payment'|'success'>('plan');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geideaSession]     = useState(mockUUID());
  const [merchantRef]       = useState(mockUUID());
  const [txnId, setTxnId]   = useState('');

  const validatePayment = () => {
    if (basePrice === 0) return true;
    const e: Record<string, string> = {};
    if (card.number.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'MM/YY required';
    if (card.cvv.length < 3) e.cvv = 'CVV required';
    if (!card.name.trim()) e.cardName = 'Name on card required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePurchase = () => {
    if (validatePayment()) { setTxnId(mockUUID()); setStep('success'); }
  };

  // ── Order summary (right rail) ─────────────────────────────────────────
  const orderSummary = (
    <div className="border border-black/10 rounded-lg overflow-hidden bg-white sticky top-24">
      <div className="px-5 py-4 border-b border-black/8 bg-surface">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em]">Order Summary</p>
      </div>
      <div className="p-5 space-y-4">
        {/* Product */}
        <div className="flex items-center gap-3 pb-4 border-b border-black/8">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-black/10 flex items-center justify-center shrink-0">
            {isBundle ? <Package size={16} strokeWidth={1.5} className="text-muted" /> : <span className="text-[10px] font-bold text-black">{product?.logo || productParam.slice(0,2).toUpperCase()}</span>}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-black">{isBundle ? (bundle?.name || bundleNameParam) : (product?.name || productParam)}</p>
            <p className="text-[11px] text-muted">{planName || 'Standard'} · {billingCycle === 'annual' ? 'Annual' : 'Monthly'}</p>
          </div>
        </div>

        {/* Price rows */}
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-muted">Software ×{licenses}</span><span className="font-semibold">{fmt(softwareTotal)}/mo</span></div>
          {billingCycle === 'annual' && annualSaving > 0 && <div className="flex justify-between text-[12px]"><span className="text-emerald-600">Annual saving</span><span className="text-emerald-600 font-semibold">{fmt(annualSaving)}/yr</span></div>}
          {managedMonthly > 0 && <div className="flex justify-between"><span className="text-muted">Managed Services</span><span className="font-semibold">+{fmt(managedMonthly)}/mo</span></div>}
          {profTotal > 0 && <div className="flex justify-between"><span className="text-muted">Prof. Services</span><span className="font-semibold">+{fmt(profTotal)}</span></div>}
          <div className="flex justify-between text-[11px]"><span className="text-muted">VAT (0% — GCC)</span><span>$0</span></div>
        </div>

        <div className="pt-3 border-t border-black/8 flex justify-between items-center">
          <span className="text-[13px] font-semibold text-black">Monthly total</span>
          <span className="text-[18px] font-bold text-black">{fmt(grandMonthly)}</span>
        </div>
        {profTotal > 0 && <p className="text-[11px] text-muted">+ {fmt(profTotal)} one-time setup</p>}

        <div className="pt-3 border-t border-black/8 space-y-2">
          {[
            { icon: <Clock size={11}/>,   text: 'Activation: 2–7 business days' },
            { icon: <Shield size={11}/>,  text: 'Secured by Geidea · GCC' },
            { icon: <Zap size={11}/>,     text: 'Cancel anytime' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-[11px] text-muted">{icon}{text}</div>
          ))}
        </div>

        {/* Deepa Rawat — Customer Success */}
        <div className="pt-3 border-t border-black/8">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2">Need help?</p>
          <div className="flex items-center gap-2.5 bg-surface border border-black/8 rounded-lg p-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-[11px] font-bold shrink-0">DR</div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-black">Deepa Rawat</p>
              <p className="text-[10px] text-muted">Customer Success · Responds in &lt;24h</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="mailto:deepa@zoftwarehub.com"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold border border-black/10 rounded-lg text-muted hover:text-black transition-colors">
              <Mail size={10}/> Email
            </a>
            <button
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold border border-black/10 rounded-lg text-muted hover:text-black transition-colors"
              onClick={() => window.dispatchEvent(new CustomEvent('zain-open'))}>
              <MessageSquare size={10}/> Chat
            </button>
          </div>
        </div>

        {isBundle && bundle && (
          <div className="pt-3 border-t border-black/8">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.07em] mb-2">Bundle includes</p>
            {bundle.items.map(item => (
              <div key={item.product} className="flex items-center gap-1.5 text-[11px] text-muted py-0.5">
                <CheckCircle size={10} className="text-accent shrink-0"/>{item.product}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Success ────────────────────────────────────────────────────────────
  if (step === 'success') return (
    <div className="min-h-[calc(100vh-56px)] bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[500px] bg-white border border-black/10 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Check size={28} className="text-emerald-600" strokeWidth={2.5}/>
        </div>
        <h1 className="text-[22px] font-semibold text-black mb-2">{basePrice === 0 ? 'Account Activated!' : 'Order Confirmed!'}</h1>
        <p className="text-[13px] text-muted mb-6">Confirmation sent to <span className="font-medium text-black">ravi.sharma@gulf-enterprises.ae</span></p>

        <div className="bg-surface rounded-lg p-4 mb-5 text-left space-y-2">
          {[
            { label: 'Order ref', value: merchantRef.split('-')[0].toUpperCase() },
            { label: 'Monthly total', value: fmt(grandMonthly) + '/mo' },
            { label: 'Licenses', value: isBundle ? `${licenses} bundle${licenses !== 1 ? 's' : ''}` : `${licenses} user${licenses !== 1 ? 's' : ''}` },
            { label: 'Activation', value: '2–7 business days' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-[12px]">
              <span className="text-muted">{label}</span><span className="font-medium text-black">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-lg p-4 mb-5 text-left">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Geidea Reference</p>
          {[
            { label: 'Session ID', value: geideaSession },
            { label: 'Transaction ID', value: txnId },
            { label: 'Status', value: '✓ Captured' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-0.5 text-[11px]">
              <span className="text-muted">{label}</span>
              <span className="font-mono text-[10px] text-black">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Link href="/software" className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-3 text-[13px] font-semibold rounded-lg hover:bg-accent-hover transition-colors">
            Browse More <ArrowRight size={13}/>
          </Link>
          <a href="mailto:success@zoftware.com" className="flex-1 flex items-center justify-center border border-black/10 text-zinc-700 py-3 text-[13px] font-medium rounded-lg hover:bg-surface transition-colors">
            Talk to us
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-56px)] bg-surface px-4 py-8 sm:py-12">
      <div className="max-w-[1000px] mx-auto">

        <Link href={isBundle ? `/bundles/${bundleSlug}` : '/software'}
          className="flex items-center gap-1.5 text-[12px] text-muted hover:text-black transition-colors mb-6 w-fit min-h-[44px]">
          <ArrowLeft size={12}/> Back
        </Link>

        {/* Welcome strip */}
        <div className="flex items-center gap-3 bg-white border border-black/10 rounded-lg px-4 py-3 mb-6 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-white">RS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-black">Welcome back, Ravi</p>
            <p className="text-[11px] text-muted">Gulf Enterprises LLC · ravi.sharma@gulf-enterprises.ae</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <CheckCircle size={9}/> Verified
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {(['plan','payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                step === s || (s === 'plan' && step === 'payment') ? 'bg-accent text-white' : 'bg-zinc-200 text-muted'
              }`}>
                {s === 'plan' && step === 'payment' ? <Check size={12} strokeWidth={2.5}/> : i + 1}
              </div>
              <span className={`text-[12px] font-medium ${step === s ? 'text-black' : 'text-muted'}`}>
                {s === 'plan' ? 'Plan & Services' : 'Payment & Details'}
              </span>
              {i < 1 && <div className="w-8 h-px bg-zinc-200 mx-1"/>}
            </div>
          ))}
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          <div className="flex-1 min-w-0 w-full space-y-4">

            {/* ════ STEP 1 — Plan & Pricing ════ */}
            {step === 'plan' && (
              <>
                {/* Billing cycle + price comparison */}
                <div className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm">
                  <h2 className="text-[16px] font-semibold text-black mb-4">Choose your plan</h2>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {(['monthly','annual'] as const).map(c => {
                      const price = c === 'annual' ? Math.round(basePrice * 0.8) : basePrice;
                      const label = c === 'annual' ? 'Annual billing' : 'Monthly billing';
                      const sub   = c === 'annual' ? `Save ${fmt(basePrice * licenseMult * 12 * 0.2)}/yr` : 'No commitment';
                      return (
                        <button key={c} onClick={() => setBillingCycle(c)}
                          className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left ${
                            billingCycle === c ? 'border-accent bg-accent/8' : 'border-black/10 bg-white hover:border-black/20'
                          }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${billingCycle === c ? 'border-accent bg-accent' : 'border-zinc-300'}`}>
                              {billingCycle === c && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                            </div>
                            <span className="text-[12px] font-semibold text-black">{label}</span>
                            {c === 'annual' && <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">−20%</span>}
                          </div>
                          <p className="text-[20px] font-bold text-black">{fmt(price * licenseMult)}</p>
                          <p className="text-[11px] text-muted">/mo · {sub}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Licenses — shown for both products and bundles */}
                  {basePrice > 0 && (
                    <div className="border-t border-black/8 pt-4">
                      <p className="text-[12px] font-semibold text-black mb-3">
                        {isBundle ? 'Number of Bundles' : 'Number of Licenses'}
                      </p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => changeLicenses(-1)} disabled={licenses <= 1}
                          className="w-9 h-9 border border-black/10 rounded-lg flex items-center justify-center hover:bg-surface disabled:opacity-30 transition-colors">
                          <Minus size={14}/>
                        </button>
                        <div className="flex-1 text-center">
                          <span className="text-[22px] font-bold text-black">{licenses}</span>
                          <p className="text-[11px] text-muted">{isBundle ? 'bundle(s)' : 'users'}</p>
                        </div>
                        <button onClick={() => changeLicenses(1)} disabled={licenses >= 500}
                          className="w-9 h-9 border border-black/10 rounded-lg flex items-center justify-center hover:bg-surface disabled:opacity-30 transition-colors">
                          <Plus size={14}/>
                        </button>
                      </div>
                      <a href="mailto:success@zoftware.com" className="mt-2 flex items-center justify-center gap-1 text-[11px] text-accent hover:underline">
                        <MessageSquare size={10}/> Need custom volume? Talk to us
                      </a>
                    </div>
                  )}
                </div>

                {/* Professional Services */}
                <div className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench size={15} strokeWidth={1.5} className="text-accent"/>
                    <h3 className="text-[14px] font-semibold text-black">Professional Services</h3>
                    <span className="ml-auto text-[10px] font-semibold text-muted bg-zinc-100 px-2 py-0.5 rounded-full">Optional · One-time</span>
                  </div>
                  <p className="text-[12px] text-muted mb-4">Accelerate your go-live with expert-led services.</p>
                  <div className="space-y-2.5">
                    {PROF_SERVICES.map(svc => (
                      <label key={svc.id} className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${profSel.includes(svc.id) ? 'border-accent/40 bg-accent/8' : 'border-black/10 hover:border-black/20'}`}>
                        <input type="checkbox" checked={profSel.includes(svc.id)} onChange={() => toggleProf(svc.id)} className="mt-0.5 accent-accent w-4 h-4 shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-black">{svc.label}</p>
                          <p className="text-[11px] text-muted leading-snug">{svc.desc}</p>
                        </div>
                        <span className="text-[13px] font-semibold text-black shrink-0">{fmt(svc.price)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Managed Services */}
                <div className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Server size={15} strokeWidth={1.5} className="text-accent"/>
                    <h3 className="text-[14px] font-semibold text-black">Managed Services</h3>
                    <span className="ml-auto text-[10px] font-semibold text-muted bg-zinc-100 px-2 py-0.5 rounded-full">Optional · Monthly</span>
                  </div>
                  <p className="text-[12px] text-muted mb-4">Ongoing managed support alongside your subscription.</p>
                  <div className="space-y-2.5">
                    {MANAGED_SERVICES.map(svc => (
                      <label key={svc.id} className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${managedSel.includes(svc.id) ? 'border-accent/40 bg-accent/8' : 'border-black/10 hover:border-black/20'}`}>
                        <input type="checkbox" checked={managedSel.includes(svc.id)} onChange={() => toggleManaged(svc.id)} className="mt-0.5 accent-accent w-4 h-4 shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-black">{svc.label}</p>
                          <p className="text-[11px] text-muted leading-snug">{svc.desc}</p>
                        </div>
                        <span className="text-[13px] font-semibold text-black shrink-0">{fmt(svc.price)}/mo</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep('payment')}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 text-[14px] font-semibold rounded-lg hover:bg-accent-hover transition-colors min-h-[48px]">
                  Continue to Payment <ArrowRight size={14} strokeWidth={2}/>
                </button>
              </>
            )}

            {/* ════ STEP 2 — Payment & Details ════ */}
            {step === 'payment' && (
              <>
                {/* Card details */}
                <div className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16px] font-semibold text-black">{basePrice === 0 ? 'Confirm Free Access' : 'Payment Details'}</h2>
                    {basePrice > 0 && (
                      <div className="flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-lg">
                        <Shield size={10} className="text-accent"/>
                        <span className="text-[10px] font-bold text-black">Geidea</span>
                        <span className="text-[9px] text-muted">GCC</span>
                      </div>
                    )}
                  </div>

                  {basePrice > 0 && (
                    <>
                      <div className="bg-accent/6 border border-accent/20 rounded-lg px-4 py-3 mb-4">
                        <p className="text-[10px] font-semibold text-accent uppercase tracking-[0.08em] mb-0.5">Geidea Session</p>
                        <p className="text-[11px] font-mono text-muted">{geideaSession}</p>
                      </div>

                      <div className="space-y-4">
                        <Field label="Card Number" value={card.number} onChange={v => {
                          const n = v.replace(/\D/g,'').slice(0,16);
                          setCard(c => ({ ...c, number: n.replace(/(.{4})/g,'$1 ').trim() }));
                        }} placeholder="4111 1111 1111 1111" icon={<CreditCard size={13}/>} error={errors.cardNumber}/>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Expiry" value={card.expiry} onChange={v => {
                            let n = v.replace(/\D/g,'');
                            if (n.length >= 2) n = n.slice(0,2)+'/'+n.slice(2,4);
                            setCard(c => ({ ...c, expiry: n }));
                          }} placeholder="MM/YY" error={errors.expiry}/>
                          <Field label="CVV" value={card.cvv} onChange={v => setCard(c => ({ ...c, cvv: v.replace(/\D/g,'').slice(0,4) }))} placeholder="123" error={errors.cvv}/>
                        </div>
                        <Field label="Name on Card" value={card.name} onChange={v => setCard(c => ({ ...c, name: v }))} placeholder="Ravi Sharma" error={errors.cardName}/>
                        <div className="flex items-center gap-2 flex-wrap">
                          {['Visa','Mastercard','Amex','Mada'].map(n => (
                            <span key={n} className="text-[10px] font-semibold border border-black/10 px-2 py-0.5 rounded-lg text-muted">{n}</span>
                          ))}
                          <span className="text-[10px] text-muted">· All GCC cards accepted</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* License & billing details */}
                <div className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-black/8">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-bold text-accent">RS</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-black">Hi Ravi, a few more details for this order</p>
                      <p className="text-[12px] text-muted">Your account info is already saved — just confirm the license details below.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="License Company" value={orderDetails.licenseCompany} onChange={v => setOrderDetails(d=>({...d,licenseCompany:v}))} placeholder="Company receiving the licenses" icon={<Building2 size={13}/>}/>
                      <Field label="Company Location" value={orderDetails.companyLocation} onChange={v => setOrderDetails(d=>({...d,companyLocation:v}))} placeholder="e.g. Dubai, UAE" icon={<MapPin size={13}/>}/>
                    </div>
                    <Field label="VAT Number" value={orderDetails.vatNo} onChange={v => setOrderDetails(d=>({...d,vatNo:v}))} placeholder="AE123456789012345" optional/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Contact Person" value={orderDetails.contactPerson} onChange={v => setOrderDetails(d=>({...d,contactPerson:v}))} placeholder="Full name" icon={<User2 size={13}/>}/>
                      <Field label="Designation" value={orderDetails.contactDesignation} onChange={v => setOrderDetails(d=>({...d,contactDesignation:v}))} placeholder="e.g. IT Manager"/>
                    </div>
                    <div className="bg-surface border border-black/8 rounded-lg px-4 py-3 flex items-center justify-between">
                      <div className="text-[12px] text-muted">Licenses allocated to this order</div>
                      <div className="text-[15px] font-bold text-black">{licenses} {isBundle ? 'bundle(s)' : 'user license(s)'}</div>
                    </div>
                  </div>
                </div>

                {/* Billing address */}
                <div className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm">
                  <h3 className="text-[15px] font-semibold text-black mb-3">Billing Address</h3>
                  <label className="flex items-center gap-2.5 cursor-pointer mb-4">
                    <input type="checkbox" checked={sameAddress} onChange={e => setSameAddress(e.target.checked)} className="w-4 h-4 accent-accent"/>
                    <span className="text-[13px] text-black">Same as registered address</span>
                  </label>
                  {!sameAddress && (
                    <div className="space-y-3 mt-3 pt-3 border-t border-black/8">
                      <Field label="Address Line 1" value={billing.line1} onChange={v => setBilling(b=>({...b,line1:v}))} placeholder="Al Quoz Industrial Area, Dubai" icon={<MapPin size={13}/>}/>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="City" value={billing.city} onChange={v => setBilling(b=>({...b,city:v}))} placeholder="Dubai"/>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.06em] mb-1.5">Country</label>
                          <div className="relative">
                            <select value={billing.country} onChange={e => setBilling(b=>({...b,country:e.target.value}))}
                              className="w-full appearance-none border border-black/10 bg-surface pl-3.5 pr-8 py-2.5 text-[13px] text-black outline-none focus:border-zinc-300 rounded-lg min-h-[42px]">
                              {['UAE','Saudi Arabia','Kuwait','Bahrain','Qatar','Oman'].map(c => <option key={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional license contacts */}
                <div className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[15px] font-semibold text-black">License Holders</h3>
                    <span className="text-[10px] font-semibold text-muted bg-zinc-100 px-2 py-0.5 rounded-full">Optional</span>
                  </div>
                  <p className="text-[12px] text-muted mb-4">Add the people who will receive license invites and billing notifications.</p>

                  {contacts.map((c, i) => (
                    <div key={i} className="border border-black/10 rounded-lg p-4 mb-3 relative">
                      <button onClick={() => removeContact(i)} className="absolute top-3 right-3 text-zinc-300 hover:text-muted transition-colors"><X size={14}/></button>
                      <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.06em] mb-3">Contact {i + 2}</p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="Full Name" value={c.name} onChange={v => updateContact(i,'name',v)} placeholder="Team member name" icon={<User2 size={13}/>}/>
                          <Field label="Designation / Role" value={c.designation} onChange={v => updateContact(i,'designation',v)} placeholder="e.g. Sales Manager"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="Email" value={c.email} onChange={v => updateContact(i,'email',v)} placeholder="email@company.ae" type="email" icon={<Mail size={13}/>}/>
                          <Field label="Phone" value={c.phone} onChange={v => updateContact(i,'phone',v)} placeholder="+971 50 000 0000" type="tel" icon={<Phone size={13}/>}/>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button onClick={addContact}
                    className="flex items-center gap-2 text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors py-2">
                    <Plus size={13}/> Add license holder
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted px-1">
                  <Lock size={11}/> 256-bit SSL · PCI-DSS compliant · Powered by Geidea
                </div>

                <button onClick={handlePurchase}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 text-[14px] font-semibold rounded-lg hover:bg-accent-hover transition-colors min-h-[48px]">
                  <Lock size={14}/>
                  {basePrice === 0 ? 'Activate Free Access' : `Complete Purchase · ${fmt(grandMonthly)}/mo`}
                </button>
                <button onClick={() => { setStep('plan'); setErrors({}); }}
                  className="w-full text-center text-[12px] text-muted hover:text-black transition-colors py-2">
                  ← Back to Plan & Services
                </button>
              </>
            )}
          </div>

          {/* Right rail */}
          <div className="w-full lg:w-72 shrink-0">
            {orderSummary}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[13px] text-muted">Loading checkout…</div>}>
      <CheckoutContent/>
    </Suspense>
  );
}
