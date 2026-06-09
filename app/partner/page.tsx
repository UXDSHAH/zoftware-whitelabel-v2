import Link from 'next/link';
import {
  ArrowRight, Layers, Cpu, Package, Globe, Smartphone, Building2,
  BarChart2, Zap, CheckCircle, ChevronRight, Star, Users, Shield,
  Boxes, Puzzle, Handshake, Store, TrendingUp, Sparkles, Code2, PenTool
} from 'lucide-react';

export const metadata = {
  title: 'Partner Program — Zoftware White-Label Platform',
  description: 'Deploy a branded software marketplace for your customers. Three flexible models: white-label platform, software gateway, or bundle builder.',
};

const tiers = [
  {
    number: '01',
    icon: <Layers size={22} strokeWidth={1.5} />,
    label: 'White-Label Platform',
    headline: 'Your brand. Our engine.',
    description:
      'Deploy a fully branded software marketplace under your own domain, logo, and color palette. Your customers never know Zoftware is behind it — they see your brand, start to finish.',
    points: [
      'Custom domain, logo & brand colors',
      'Pre-loaded with 50+ verified software products',
      'Deploy on your cloud or on-premises',
      'Your pricing, your margins, your contracts',
      'White-glove onboarding & dedicated support',
    ],
    visual: {
      title: 'Partner Portal Preview',
      items: ['phonepay-software.com', 'gtr-marketplace.io', 'yourbank-tools.com'],
    },
    accent: '#007AFF',
    bg: '#EFF6FF',
  },
  {
    number: '02',
    icon: <Smartphone size={22} strokeWidth={1.5} />,
    label: 'Software Gateway',
    headline: 'One icon. Infinite software.',
    description:
      'Embed the Zoftware marketplace as a single icon or tile inside your existing platform — POS device, mobile app, or web portal. Customers click, land in a curated store, and buy. Zero friction.',
    points: [
      'Single API or iframe embed — ships in days',
      'Works on POS terminals, mobile apps & web',
      'Branded mini-store inside your product',
      'Revenue share on every transaction',
      'Real-time analytics dashboard',
    ],
    visual: {
      title: 'Embedded Gateway Demo',
      device: true,
    },
    accent: '#5856D6',
    bg: '#F5F3FF',
  },
  {
    number: '03',
    icon: <Package size={22} strokeWidth={1.5} />,
    label: 'Bundle Builder',
    headline: 'Sell packages, not just products.',
    description:
      'Build curated bundles of software, services, and consulting for your customers. Mix and match — CRM + WhatsApp integration + onboarding consulting — and sell them as a single SKU with one price.',
    points: [
      'AI recommends bundles by industry & size',
      'Software + service + consulting in one package',
      'Customers mix & match to fit their needs',
      'Bundled billing, single invoice',
      'Upsell and cross-sell built-in',
    ],
    visual: {
      title: 'Bundle Builder Preview',
      bundle: true,
    },
    accent: '#34C759',
    bg: '#F0FDF4',
  },
];

const bundleExamples = [
  {
    name: 'Retail Starter Pack',
    category: 'Retail & POS',
    items: ['Point-of-Sale Software', 'Inventory Management', 'WhatsApp Business', 'Onboarding (8 hrs)'],
    price: '$299/mo',
    tag: 'Most Popular',
    tagColor: '#007AFF',
  },
  {
    name: 'Finance Operations Bundle',
    category: 'BFSI',
    items: ['Accounting & GST', 'Payroll Software', 'Document Management', 'Setup Consulting'],
    price: '$399/mo',
    tag: 'AI Recommended',
    tagColor: '#5856D6',
  },
  {
    name: 'Restaurant Growth Kit',
    category: 'F&B',
    items: ['Restaurant POS', 'Online Ordering', 'Customer Loyalty', 'Marketing Tools'],
    price: '$249/mo',
    tag: 'New Bundle',
    tagColor: '#34C759',
  },
];

const partners = ['PhonePe', 'GTR POS', 'Axis Bank', 'HDFC SmartHub', 'Paytm for Business', 'IndusInd'];

const stats = [
  { value: '50+', label: 'Software Products' },
  { value: '600+', label: 'Categories' },
  { value: '5,000+', label: 'Businesses Served' },
  { value: '30+', label: 'Countries' },
];

export default function PartnerPage() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 sm:pb-14">
        <div className="inline-flex items-center gap-2 bg-accent/8 text-accent px-3 py-1 rounded-sm text-[11px] font-semibold tracking-[0.08em] uppercase mb-5 sm:mb-6">
          <Handshake size={12} strokeWidth={2} /> Partner Program
        </div>
        <h1 className="text-[32px] sm:text-[46px] lg:text-[54px] font-medium text-black tracking-tight leading-[1.05] mb-4 sm:mb-5 max-w-[700px]">
          Give your customers<br />
          <span className="text-accent">a software marketplace.</span>
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[#555555] leading-[1.65] max-w-[520px] mb-6 sm:mb-8">
          Three flexible models to embed, brand, or bundle the Zoftware platform — built for banks, fintechs, POS networks, and enterprise resellers.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="#contact"
            className="flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 sm:py-2.5 text-[14px] font-medium rounded-sm hover:bg-accent-hover transition-colors min-h-[44px]"
          >
            Talk to us <ArrowRight size={15} strokeWidth={2} />
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center justify-center gap-2 text-[14px] text-black border border-black/10 px-5 py-3 sm:py-2.5 hover:bg-surface bg-white rounded-sm font-medium transition-colors min-h-[44px]"
          >
            See how it works <ChevronRight size={15} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Partner logos strip */}
        <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-black/8">
          <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-3 sm:mb-4">Trusted by leading platforms</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {partners.map(p => (
              <span key={p} className="text-[13px] font-semibold text-[#999] tracking-tight">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="bg-black">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-[28px] font-semibold text-white tracking-tight">{value}</p>
              <p className="text-[12px] text-[#999] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 TIERS ── */}
      <section id="how-it-works" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 sm:mb-12">
          <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-2">Three Partnership Models</p>
          <h2 className="text-[24px] sm:text-[30px] font-semibold text-black tracking-tight">Pick the model that fits your business</h2>
        </div>

        <div className="flex flex-col gap-6 sm:gap-10">
          {tiers.map((tier) => (
            <div key={tier.number} className="border border-black/8 rounded-sm overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left: content */}
                <div className="flex-1 p-5 sm:p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
                      style={{ backgroundColor: tier.bg, color: tier.accent }}
                    >
                      {tier.icon}
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold tracking-[0.12em] uppercase"
                        style={{ color: tier.accent }}
                      >
                        Tier {tier.number} · {tier.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-[24px] font-semibold text-black tracking-tight mb-3">{tier.headline}</h3>
                  <p className="text-[14px] text-[#555] leading-[1.7] mb-6 max-w-[480px]">{tier.description}</p>

                  <ul className="space-y-2.5">
                    {tier.points.map(pt => (
                      <li key={pt} className="flex items-start gap-2.5 text-[13px] text-black">
                        <CheckCircle size={15} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: tier.accent }} />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-1.5 mt-7 text-[13px] font-semibold transition-colors"
                    style={{ color: tier.accent }}
                  >
                    Get started <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Right: visual mockup */}
                <div
                  className="lg:w-[340px] xl:w-[380px] p-6 lg:p-8 flex flex-col justify-center shrink-0 border-t lg:border-t-0 lg:border-l border-black/8"
                  style={{ backgroundColor: tier.bg }}
                >
                  {tier.visual.items && (
                    <TierOneVisual items={tier.visual.items} accent={tier.accent} />
                  )}
                  {tier.visual.device && (
                    <TierTwoVisual accent={tier.accent} />
                  )}
                  {tier.visual.bundle && (
                    <TierThreeVisual accent={tier.accent} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUNDLE EXAMPLES ── */}
      <section className="bg-surface border-y border-black/5 py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-1.5">Bundle Builder in Action</p>
              <h2 className="text-[26px] font-semibold text-black tracking-tight">Pre-built packages your customers love</h2>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors shrink-0">
              Browse all products <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bundleExamples.map(bundle => (
              <div key={bundle.name} className="bg-white border border-black/8 rounded-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em]">{bundle.category}</span>
                    <h3 className="text-[15px] font-semibold text-black mt-0.5">{bundle.name}</h3>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-sm shrink-0 ml-2"
                    style={{ backgroundColor: bundle.tagColor + '18', color: bundle.tagColor }}
                  >
                    {bundle.tag}
                  </span>
                </div>

                <ul className="space-y-2 mb-5">
                  {bundle.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-[12px] text-[#333]">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-black/8">
                  <div>
                    <p className="text-[18px] font-semibold text-black">{bundle.price}</p>
                    <p className="text-[10px] text-muted">billed monthly</p>
                  </div>
                  <Link href="#contact" className="text-[12px] font-semibold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors">
                    License this <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[12px] text-muted mt-6 flex items-center justify-center gap-1.5">
            <Sparkles size={12} /> AI automatically recommends bundles based on your customer&apos;s industry and company size.
          </p>
        </div>
      </section>

      {/* ── HOW DEPLOYMENT WORKS ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="mb-10">
          <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-2">Simple Deployment</p>
          <h2 className="text-[26px] font-semibold text-black tracking-tight">Go live in days, not months</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', icon: <Handshake size={18} strokeWidth={1.5} />, title: 'Sign Partner Agreement', body: 'Choose your tier, set your margin, and sign the agreement. Takes 30 minutes.' },
            { step: '2', icon: <PenTool size={18} strokeWidth={1.5} />, title: 'Brand Configuration', body: 'Submit your logo, colors, and domain. We configure the platform to match your brand.' },
            { step: '3', icon: <Code2 size={18} strokeWidth={1.5} />, title: 'Integrate or Deploy', body: 'Embed the gateway with 1 line of code, or we deploy the full white-label on your infrastructure.' },
            { step: '4', icon: <TrendingUp size={18} strokeWidth={1.5} />, title: 'Launch & Earn', body: 'Go live, start selling. Track revenue, orders, and customer activity in your dashboard.' },
          ].map(({ step, icon, title, body }) => (
            <div key={step} className="border border-black/8 rounded-sm p-5 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-sm bg-black flex items-center justify-center text-white shrink-0">{icon}</div>
                <span className="text-[11px] font-bold text-muted tracking-[0.1em] uppercase">Step {step}</span>
              </div>
              <h3 className="text-[14px] font-semibold text-black mb-1.5">{title}</h3>
              <p className="text-[12px] text-muted leading-[1.65]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className="bg-surface border-y border-black/5 py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-2">Ideal Partners</p>
            <h2 className="text-[26px] font-semibold text-black tracking-tight">Built for platforms with business customers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Smartphone size={18} strokeWidth={1.5} />, name: 'Fintech & Payments', desc: 'PhonePe, Paytm, Razorpay — add a software store to your existing app and earn on every transaction.' },
              { icon: <Store size={18} strokeWidth={1.5} />, name: 'POS & Hardware Networks', desc: 'GTR, Pine Labs, Mswipe — pre-load a marketplace on every terminal you ship.' },
              { icon: <Building2 size={18} strokeWidth={1.5} />, name: 'Banks & NBFCs', desc: 'Offer business software as a value-add to SME customers through your net banking or merchant portal.' },
              { icon: <Globe size={18} strokeWidth={1.5} />, name: 'Telecom & ISPs', desc: 'Bundle software with your connectivity plans. Add stickiness, reduce churn, grow ARPU.' },
              { icon: <Users size={18} strokeWidth={1.5} />, name: 'Business Associations', desc: 'Chamber of commerce, industry bodies — give members a curated, discounted software marketplace.' },
              { icon: <Boxes size={18} strokeWidth={1.5} />, name: 'Distributor Networks', desc: 'IT distributors and resellers — own a branded marketplace and sell digital products alongside hardware.' },
            ].map(({ icon, name, desc }) => (
              <div key={name} className="bg-white border border-black/8 rounded-sm p-5">
                <div className="w-9 h-9 rounded-sm bg-surface border border-black/8 flex items-center justify-center text-black mb-3">{icon}</div>
                <h3 className="text-[14px] font-semibold text-black mb-1.5">{name}</h3>
                <p className="text-[12px] text-muted leading-[1.65]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVENUE MODEL ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-2">Revenue Model</p>
            <h2 className="text-[26px] font-semibold text-black tracking-tight mb-4">You set the price. You keep the margin.</h2>
            <p className="text-[14px] text-[#555] leading-[1.7] mb-6">
              Zoftware handles procurement, licensing, and support infrastructure. You set the price to your customers, earn the margin, and we settle monthly. No upfront inventory, no licensing risk.
            </p>
            <ul className="space-y-3">
              {[
                'Set your own retail price on every product',
                'Earn 15–40% margin depending on category',
                'Monthly settlement, transparent reporting',
                'Volume bonuses as your customer base grows',
                'Co-marketing budget for top partners',
              ].map(pt => (
                <li key={pt} className="flex items-start gap-2.5 text-[13px] text-black">
                  <CheckCircle size={15} strokeWidth={1.5} className="text-[#34C759] shrink-0 mt-0.5" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface border border-black/8 rounded-sm p-6">
            <p className="text-[12px] font-semibold text-muted uppercase tracking-[0.08em] mb-4">Example Revenue Scenario</p>
            <div className="space-y-3">
              {[
                { label: 'Active business customers', value: '500' },
                { label: 'Avg software spend per customer', value: '$120/mo' },
                { label: 'Platform GMV (monthly)', value: '$60,000' },
                { label: 'Your margin (at 25%)', value: '$15,000/mo', highlight: true },
                { label: 'Annual partner revenue', value: '$180,000', highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className={`flex items-center justify-between py-2.5 px-3 rounded-sm ${highlight ? 'bg-accent text-white' : 'bg-white border border-black/8'}`}>
                  <span className={`text-[12px] ${highlight ? 'text-white/80' : 'text-[#555]'}`}>{label}</span>
                  <span className={`text-[14px] font-semibold ${highlight ? 'text-white' : 'text-black'}`}>{value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted mt-3">* Illustrative figures. Actual margins vary by category and agreement.</p>
          </div>
        </div>
      </section>

      {/* ── CONTACT / CTA ── */}
      <section id="contact" className="bg-black py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-3">Get in Touch</p>
              <h2 className="text-[30px] font-semibold text-white tracking-tight mb-4">Ready to add software to your platform?</h2>
              <p className="text-[14px] text-[#999] leading-[1.7] mb-6">
                Drop us your details and a Zoftware partner manager will reach out within one business day to walk you through the models and draft a commercial proposal.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { icon: <Zap size={13} />, label: 'Response within 24 hrs' },
                  { icon: <Shield size={13} />, label: 'NDA available on request' },
                  { icon: <Star size={13} />, label: 'Dedicated partner manager' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[12px] text-[#999]">
                    <span className="text-[#555]">{icon}</span>{label}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <form className="bg-white rounded-sm p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-1.5">First Name</label>
                  <input
                    type="text"
                    placeholder="Ravi"
                    className="w-full bg-surface border-0 px-3 py-2.5 text-[13px] text-black placeholder-[#bbb] rounded-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-colors min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Sharma"
                    className="w-full bg-surface border-0 px-3 py-2.5 text-[13px] text-black placeholder-[#bbb] rounded-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-colors min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-1.5">Work Email</label>
                <input
                  type="email"
                  placeholder="ravi@phonepe.com"
                  className="w-full bg-surface border-0 px-3 py-2.5 text-[13px] text-black placeholder-[#bbb] rounded-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-colors min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-1.5">Company</label>
                <input
                  type="text"
                  placeholder="PhonePe / GTR / Axis Bank..."
                  className="w-full bg-surface border-0 px-3 py-2.5 text-[13px] text-black placeholder-[#bbb] rounded-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-colors min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-1.5">Partnership Model</label>
                <select className="w-full bg-surface border-0 px-3 py-2.5 text-[13px] text-black rounded-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-colors min-h-[44px]">
                  <option value="">Select a model...</option>
                  <option value="tier1">Tier 1 — White-Label Platform</option>
                  <option value="tier2">Tier 2 — Software Gateway</option>
                  <option value="tier3">Tier 3 — Bundle Builder</option>
                  <option value="all">All three / Not sure yet</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-1.5">Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your platform and customer base..."
                  className="w-full bg-surface border-0 px-3 py-2 text-[13px] text-black placeholder-[#bbb] rounded-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent text-white py-3 text-[14px] font-semibold rounded-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                Submit Enquiry <ArrowRight size={15} strokeWidth={2} />
              </button>
              <p className="text-center text-[10px] text-muted">We do not share your details with any third party.</p>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Tier visual sub-components ── */

function TierOneVisual({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Your branded domains</p>
      {items.map((domain, i) => (
        <div key={domain} className="bg-white border border-black/10 rounded-sm px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
            <Globe size={10} strokeWidth={2} className="text-white" />
          </div>
          <span className="text-[12px] font-medium text-black font-mono">{domain}</span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#34C759] shrink-0" />
        </div>
      ))}
      <div className="mt-3 pt-3 border-t border-black/10">
        <p className="text-[11px] text-muted">Powered by <span className="font-semibold text-black">Zoftware Engine</span></p>
      </div>
    </div>
  );
}

function TierTwoVisual({ accent }: { accent: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Inside your existing app</p>
      {/* Simulated app screen */}
      <div className="bg-white border border-black/12 rounded-sm overflow-hidden">
        {/* App header */}
        <div className="px-3 py-2 border-b border-black/8 flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-[#FF3B30] opacity-70" />
          <span className="text-[11px] font-semibold text-black">PhonePe for Business</span>
        </div>
        {/* App grid */}
        <div className="p-3 grid grid-cols-4 gap-2">
          {['Payments', 'Loans', 'Insurance', 'Analytics', 'Payroll', 'Invoices', 'Inventory'].map(item => (
            <div key={item} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-sm bg-surface border border-black/8 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-[#ccc]" />
              </div>
              <span className="text-[8px] text-muted text-center leading-tight">{item}</span>
            </div>
          ))}
          {/* The Zoftware tile — highlighted */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shadow-sm border-2" style={{ backgroundColor: accent + '18', borderColor: accent }}>
              <Puzzle size={14} strokeWidth={1.5} style={{ color: accent }} />
            </div>
            <span className="text-[8px] font-semibold text-center leading-tight" style={{ color: accent }}>Software</span>
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="rounded-sm p-2 text-[9px] font-semibold text-white text-center" style={{ backgroundColor: accent }}>
            Tap to browse 50+ tools →
          </div>
        </div>
      </div>
    </div>
  );
}

function TierThreeVisual({ accent }: { accent: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Bundle preview</p>
      <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-black/8 flex items-center gap-2">
          <Package size={13} strokeWidth={1.5} style={{ color: accent }} />
          <span className="text-[12px] font-semibold text-black">Retail Starter Pack</span>
        </div>
        <div className="p-3 space-y-2">
          {[
            { label: 'Point-of-Sale', type: 'Software' },
            { label: 'Inventory Mgmt', type: 'Software' },
            { label: 'WhatsApp Biz', type: 'Integration' },
            { label: 'Onboarding', type: 'Service' },
          ].map(({ label, type }) => (
            <div key={label} className="flex items-center gap-2 text-[11px]">
              <CheckCircle size={11} strokeWidth={1.5} style={{ color: accent }} />
              <span className="text-black flex-1">{label}</span>
              <span className="text-muted text-[9px] bg-surface px-1.5 py-0.5 rounded-sm">{type}</span>
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[16px] font-semibold text-black">$299</span>
            <span className="text-[10px] text-muted">/mo</span>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm" style={{ backgroundColor: accent + '18', color: accent }}>Save 30%</span>
        </div>
      </div>
    </div>
  );
}
