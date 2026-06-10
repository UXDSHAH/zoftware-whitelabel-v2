'use client';

import { use, useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Download, FileText, BarChart2, Check, ArrowRight,
  Building2, Calendar, Users, Shield, Zap, Package, Star,
} from 'lucide-react';

// ── Questions ────────────────────────────────────────────────────────────────

const REQ_QUESTIONS = [
  {
    key: 'category', label: 'Software Category',
    text: "Hi! I'll help you build a personalised requirements report. First — what type of software are you looking for?",
    quickReplies: ['CRM / Sales', 'ERP / Operations', 'HR & Payroll', 'Marketing Automation', 'Accounting / Finance'],
  },
  {
    key: 'purpose', label: 'Purchase Type',
    text: 'Got it. Is this a new purchase or are you replacing an existing system?',
    quickReplies: ['New purchase', 'Replacing existing system', 'Adding to existing stack'],
  },
  {
    key: 'teamSize', label: 'Team Size',
    text: 'How many users will need access to this software?',
    quickReplies: ['< 10 users', '10–50 users', '50–200 users', '200+ users'],
  },
  {
    key: 'budget', label: 'Annual Budget',
    text: "What's your annual software budget for this?",
    quickReplies: ['< $10,000/yr', '$10k–$50k/yr', '$50k–$150k/yr', '$150k+/yr'],
  },
  {
    key: 'deployment', label: 'Deployment',
    text: 'Do you have a deployment preference?',
    quickReplies: ['Cloud SaaS', 'On-Premise', 'Hybrid', 'No preference'],
  },
  {
    key: 'timeline', label: 'Go-live Timeline',
    text: 'What is your target go-live timeline?',
    quickReplies: ['< 1 month', '1–3 months', '3–6 months', '6+ months'],
  },
  {
    key: 'integrations', label: 'Integrations',
    text: 'Will you need integrations with other tools?',
    quickReplies: ['No integrations needed', 'Yes — a few key tools', 'Yes — extensive integrations'],
  },
  {
    key: 'companyType', label: 'Company Type',
    text: 'How would you describe your organisation?',
    quickReplies: ['SME (< 200 employees)', 'Mid-Market (200–1,000)', 'Enterprise (1,000+)'],
  },
  {
    key: 'vendorPref', label: 'Local Vendor',
    text: 'Is a GCC-based or local vendor important to you?',
    quickReplies: ['Yes — very important', 'No preference'],
  },
  {
    key: 'compliance', label: 'Compliance',
    text: 'Any compliance requirements we should factor in?',
    quickReplies: ['None', 'ISO 27001', 'SOC 2', 'Industry-specific (HIPAA, PCI, etc.)'],
  },
  {
    key: 'challenge', label: 'Key Challenge',
    text: "Almost done — what's the core challenge this software needs to solve?",
    quickReplies: ['Lead / pipeline management', 'Cost control & visibility', 'Too many manual processes', 'Data scattered across tools'],
  },
];

const STR_QUESTIONS = [
  {
    key: 'role', label: 'Your Role',
    text: "Hi! Let's build your personalised tech strategy roadmap. What's your role?",
    quickReplies: ['CTO / Head of IT', 'Operations Director', 'COO', 'CEO / Founder'],
  },
  {
    key: 'industry', label: 'Industry',
    text: 'Great. What industry are you in?',
    quickReplies: ['Manufacturing / Trading', 'Retail / E-commerce', 'Healthcare', 'Finance & Banking', 'Real Estate', 'Professional Services'],
  },
  {
    key: 'companySize', label: 'Company Size',
    text: 'How large is your organisation?',
    quickReplies: ['< 50 employees', '50–200 employees', '200–1,000 employees', '1,000+ employees'],
  },
  {
    key: 'objective', label: 'Primary Objective',
    text: "What's your primary objective right now?",
    quickReplies: ['Unify finance, sales & operations', 'Reduce operational costs', 'Scale faster', 'Improve customer experience'],
  },
  {
    key: 'breakdown', label: 'Biggest Breakdown',
    text: "Where's your biggest operational breakdown today?",
    quickReplies: ['Reporting & approvals are slow', 'Data silos across teams', 'Too many manual processes', 'Integration failures'],
  },
  {
    key: 'currentSetup', label: 'Current Tech Setup',
    text: 'How would you describe your current tech stack?',
    quickReplies: ['No ERP yet', 'ERP but heavily customised', 'Multiple disconnected tools', 'Modern but incomplete'],
  },
  {
    key: 'criticality', label: 'Business Criticality',
    text: 'Last one — how critical is fixing this right now?',
    quickReplies: ['Blocking our growth', 'Creating major inefficiencies', 'Important but manageable', 'Nice to have improvement'],
  },
];

// ── Static report data (recommendations / phases stay curated) ───────────────

const REQ_RECOMMENDATIONS = [
  {
    rank: 1, name: 'Freshsales', vendor: 'Freshworks', category: 'CRM & Sales',
    logo: 'FS', score: 94, label: 'Excellent Match',
    price: '$72/user/mo', annualTotal: '$86,400/yr (10 users)',
    reason: 'AI-powered CRM with built-in telephony, email sequences, and deal pipeline. GCC data residency available. 7-day activation.',
    features: ['Pipeline management', 'AI lead scoring', 'Built-in calling', 'Email automation', 'Custom dashboards', 'API integrations'],
    pros: ['Strong GCC presence', 'Freshworks ecosystem synergy', 'Fast deployment'],
    cons: ['Higher per-seat cost at scale', 'Limited native HR integration'],
  },
  {
    rank: 2, name: 'Zoho CRM', vendor: 'Zoho', category: 'CRM & Sales',
    logo: 'ZC', score: 87, label: 'Excellent Match',
    price: '$21.85/user/mo', annualTotal: '$26,220/yr (10 users)',
    reason: 'Cost-effective omnichannel CRM with Zia AI. Best value in the GCC market. Deep Zoho ecosystem integration.',
    features: ['Contact management', 'Workflow automation', 'Zia AI insights', 'Multi-channel', 'Blueprint process design', 'Territory management'],
    pros: ['Best TCO in category', 'Wide integration library', 'Local Zoho office in Dubai'],
    cons: ['UI learning curve', 'Advanced features require higher tier'],
  },
  {
    rank: 3, name: 'HubSpot CRM', vendor: 'HubSpot', category: 'CRM & Sales',
    logo: 'HS', score: 81, label: 'Good Match',
    price: '$19/user/mo', annualTotal: '$22,800/yr (10 users)',
    reason: 'Marketing + sales CRM with a real free tier. Ideal if marketing automation is equally important.',
    features: ['Free CRM tier', 'Email marketing', 'Deal tracking', 'Forms & landing pages', 'Contact scoring', 'Reporting dashboard'],
    pros: ['Strong free tier', 'Marketing automation built-in', 'Easy onboarding'],
    cons: ['GCC data residency not guaranteed', 'Costs scale steeply at higher tiers'],
  },
];

const REQ_NEXT_STEPS = [
  'Schedule demos with shortlisted vendors (Freshsales, Zoho CRM)',
  'Request GCC data residency confirmation from vendor',
  'Confirm data migration scope and timeline with IT team',
  'Define user roles and permission structure before procurement',
  'Negotiate multi-year pricing for 20%+ additional savings',
];

const STR_PHASES = [
  {
    phase: 'Phase 1', title: 'Stabilise — Unify your data foundation', duration: 'Months 1–4', color: '#007AFF',
    goal: 'Eliminate the gap between data and operational reality by consolidating onto a modern ERP.',
    actions: [
      'Audit current ERP customisations — identify what to keep vs retire',
      'Run vendor evaluations: Odoo, Microsoft Dynamics 365, NetSuite',
      'Define master data standards (customers, products, vendors)',
      'Engage implementation partner with GCC ERP experience',
      'Plan phased go-live: Finance → Operations → Sales',
    ],
    products: ['Microsoft Dynamics 365', 'Odoo Enterprise', 'NetSuite'],
    kpis: ['ERP adoption rate > 80%', 'Manual data entry reduced by 60%', 'Single source of truth for inventory'],
  },
  {
    phase: 'Phase 2', title: 'Automate — Connect and streamline workflows', duration: 'Months 5–9', color: '#0051D5',
    goal: 'Once data is centralised, eliminate manual bottlenecks in approvals, reconciliations, and reporting.',
    actions: [
      'Integrate ERP with accounting and finance tools',
      'Deploy approval workflow automation (PO, leave, expenses)',
      'Set up real-time dashboards for management reporting',
      'Connect customer-facing systems to ERP order management',
      'Train cross-functional power users as internal champions',
    ],
    products: ['Zoho Books', 'Freshservice', 'Power Automate'],
    kpis: ['Month-end close under 3 days', 'PO approval cycle < 24 hours', 'Reporting time reduced by 70%'],
  },
  {
    phase: 'Phase 3', title: 'Optimise — Intelligence and scale', duration: 'Months 10–18', color: '#000000',
    goal: 'Move from reactive reporting to proactive decision-making with BI and predictive analytics.',
    actions: [
      'Deploy BI layer on top of ERP data (Power BI / Tableau)',
      'Build executive dashboards with drill-down by entity, region, SKU',
      'Implement demand forecasting and inventory optimisation',
      'Explore AI-assisted procurement and vendor scoring',
      'Document SOPs and train second line of ERP administrators',
    ],
    products: ['Power BI', 'Tableau', 'Microsoft Copilot'],
    kpis: ['Forecast accuracy > 85%', 'Inventory holding cost reduced by 20%', 'Zero manual management reports'],
  },
];

const STR_INVESTMENT = [
  { item: 'ERP Licences (20 users, annual)', cost: '$24,000–$48,000/yr' },
  { item: 'Implementation Partner', cost: '$15,000–$40,000 one-time' },
  { item: 'BI Tools', cost: '$3,000–$8,000/yr' },
  { item: 'Training & Change Management', cost: '$5,000–$10,000 one-time' },
  { item: 'Managed Support (optional)', cost: '$2,400/yr' },
];

// ── Utilities ────────────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

interface Msg { from: 'bot' | 'user'; text: string; id: number; }

// ── Page ─────────────────────────────────────────────────────────────────────

// ── Static dummy answers for demo report ─────────────────────────────────────

const DUMMY_REQ_INPUTS = [
  { label: 'Software Category', value: 'CRM / Sales' },
  { label: 'Purpose', value: 'Replacing existing system' },
  { label: 'Team Size', value: '10–50 users' },
  { label: 'Annual Budget', value: '$10k–$50k/yr' },
  { label: 'Deployment', value: 'Cloud SaaS' },
  { label: 'Go-live Timeline', value: '1–3 months' },
  { label: 'Integrations Needed', value: 'Yes — a few key tools' },
  { label: 'Company Type', value: 'SME (< 200 employees)' },
  { label: 'Local Vendor Preference', value: 'Yes — very important' },
  { label: 'Compliance', value: 'None' },
  { label: 'Key Challenge', value: 'Lead / pipeline management' },
];

const DUMMY_STR_PROFILE = [
  { label: 'Role', value: 'CTO / Head of IT' },
  { label: 'Industry', value: 'Manufacturing / Trading' },
  { label: 'Company Size', value: '200–1,000 employees' },
  { label: 'Primary Objective', value: 'Unify finance, sales & operations' },
  { label: 'Biggest Breakdown', value: 'Data silos across teams' },
  { label: 'Current Tech Setup', value: 'Multiple disconnected tools' },
  { label: 'Business Criticality', value: 'Blocking our growth' },
];

export default function ReportPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const router = useRouter();
  const isRequirements = type === 'requirements';
  const QUESTIONS = isRequirements ? REQ_QUESTIONS : STR_QUESTIONS;

  const [phase, setPhase] = useState<'wizard' | 'generating' | 'report'>('report');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lockedQs, setLockedQs] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextQRef = useRef(0);

  const reqInputs = useMemo(() => Object.keys(answers).length > 0
    ? [
        { label: 'Software Category', value: answers.category || '—' },
        { label: 'Purpose', value: answers.purpose || '—' },
        { label: 'Team Size', value: answers.teamSize || '—' },
        { label: 'Annual Budget', value: answers.budget || '—' },
        { label: 'Deployment', value: answers.deployment || '—' },
        { label: 'Go-live Timeline', value: answers.timeline || '—' },
        { label: 'Integrations Needed', value: answers.integrations || '—' },
        { label: 'Company Type', value: answers.companyType || '—' },
        { label: 'Local Vendor Preference', value: answers.vendorPref || '—' },
        { label: 'Compliance', value: answers.compliance || '—' },
        { label: 'Key Challenge', value: answers.challenge || '—' },
      ]
    : DUMMY_REQ_INPUTS, [answers]);

  const strProfile = useMemo(() => Object.keys(answers).length > 0
    ? [
        { label: 'Role', value: answers.role || '—' },
        { label: 'Industry', value: answers.industry || '—' },
        { label: 'Company Size', value: answers.companySize || '—' },
        { label: 'Primary Objective', value: answers.objective || '—' },
        { label: 'Biggest Breakdown', value: answers.breakdown || '—' },
        { label: 'Current Tech Setup', value: answers.currentSetup || '—' },
        { label: 'Business Criticality', value: answers.criticality || '—' },
      ]
    : DUMMY_STR_PROFILE, [answers]);

  async function askQuestion(idx: number) {
    if (idx >= QUESTIONS.length) {
      setPhase('generating');
      setTimeout(() => setPhase('report'), 2200);
      return;
    }
    setIsTyping(true);
    await sleep(900);
    setIsTyping(false);
    setMessages(prev => [...prev, { from: 'bot' as const, text: QUESTIONS[idx].text, id: Date.now() }]);
    nextQRef.current = idx + 1;
  }

  useEffect(() => {
    if (phase === 'wizard') askQuestion(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleReply(qKey: string, reply: string) {
    if (lockedQs.has(qKey)) return;
    setLockedQs(prev => new Set([...prev, qKey]));
    setAnswers(prev => ({ ...prev, [qKey]: reply }));
    setMessages(prev => [...prev, { from: 'user' as const, text: reply, id: Date.now() }]);
    const next = nextQRef.current;
    setTimeout(() => askQuestion(next), 500);
  }

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  // ── Generating screen ────────────────────────────────────────────────────
  if (phase === 'generating') {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center px-4">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center animate-pulse"
            style={{ background: isRequirements ? 'linear-gradient(135deg,#007AFF,#0051D5)' : 'linear-gradient(135deg,#0051D5,#003CA6)' }}>
            {isRequirements ? <FileText size={24} className="text-white" /> : <BarChart2 size={24} className="text-white" />}
          </div>
          <p className="text-[16px] font-semibold text-black mb-2">Generating your report…</p>
          <p className="text-[13px] text-muted mb-6">Analysing your inputs and matching software recommendations</p>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-2 h-2 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Report view ──────────────────────────────────────────────────────────
  if (phase === 'report') {
    const reportTitle = isRequirements ? 'Tech Requirements Report' : 'Tech Strategy Roadmap';
    const reportSubtitle = isRequirements
      ? `Software Procurement RFP — ${reqInputs[0].value} · ${reqInputs[7].value}`
      : `ERP & Core Operations — ${strProfile[1].value} · ${strProfile[2].value}`;
    const accentGrad = isRequirements
      ? 'linear-gradient(135deg,#007AFF,#0051D5)'
      : 'linear-gradient(135deg,#0051D5,#003CA6)';

    return (
      <div className="min-h-screen bg-[#f8faff]">

        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-black/8">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}
                className="flex items-center gap-1.5 text-[12px] text-muted hover:text-black transition-colors">
                <ArrowLeft size={13} /> Back
              </button>
              <span className="text-[#e5e5e7]">|</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: accentGrad }}>
                  {isRequirements ? <FileText size={12} className="text-white" /> : <BarChart2 size={12} className="text-white" />}
                </div>
                <span className="text-[13px] font-semibold text-black">{reportTitle}</span>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-accent px-3 py-1.5 rounded-sm hover:bg-accent-hover transition-colors">
              <Download size={12} /> Download PDF
            </button>
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Report header */}
          <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-black/8"
              style={{ background: isRequirements ? 'linear-gradient(135deg,#eff6ff,#f8fbff)' : 'linear-gradient(135deg,#eef2ff,#f8fbff)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: accentGrad }}>
                      {isRequirements ? <FileText size={14} className="text-white" /> : <BarChart2 size={14} className="text-white" />}
                    </div>
                    <span className="text-[11px] font-bold text-accent uppercase tracking-[0.1em]">{reportTitle}</span>
                  </div>
                  <h1 className="text-[22px] sm:text-[26px] font-semibold text-black tracking-tight mb-1">{reportSubtitle}</h1>
                  <p className="text-[13px] text-muted">Software Gateway · Powered by Zoftware</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-muted">Generated</p>
                  <p className="text-[13px] font-semibold text-black">June 2026</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-black/6 border-b border-black/8">
              {[
                { icon: <Building2 size={12} />, label: 'Company', value: isRequirements ? reqInputs[7].value : strProfile[2].value },
                { icon: <Calendar size={12} />, label: 'Generated', value: 'June 2026' },
                { icon: isRequirements ? <Users size={12} /> : <Zap size={12} />,
                  label: isRequirements ? 'Users' : 'Focus area',
                  value: isRequirements ? reqInputs[2].value : 'ERP & Operations' },
                { icon: <Shield size={12} />, label: 'Confidential', value: 'Internal use only' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-muted mb-0.5">{icon}<span className="text-[10px]">{label}</span></div>
                  <p className="text-[12px] font-semibold text-black truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Requirements body ── */}
          {isRequirements && (
            <>
              <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Requirements Summary</p>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reqInputs.map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Check size={13} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                      <div>
                        <p className="text-[11px] text-muted">{label}</p>
                        <p className="text-[13px] font-medium text-black">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Software Recommendations</p>
                <div className="space-y-4">
                  {REQ_RECOMMENDATIONS.map(r => (
                    <div key={r.rank} className="bg-white border border-black/8 rounded-sm overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-black/8 bg-[#f9fafb]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-sm bg-surface border border-black/8 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-black">{r.logo}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-semibold text-black">{r.name}</p>
                              <span className="text-[9px] font-bold text-muted bg-surface px-1.5 py-0.5 rounded-sm">#{r.rank}</span>
                            </div>
                            <p className="text-[11px] text-muted">{r.vendor} · {r.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-[13px] font-semibold text-black">{r.price}</p>
                            <p className="text-[10px] text-muted">{r.annualTotal}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            r.score >= 90 ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#dbeafe] text-accent'
                          }`}>{r.score}% {r.label}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-[13px] text-[#555] leading-[1.65] mb-4">{r.reason}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Key Features</p>
                            <div className="space-y-1.5">
                              {r.features.map(f => (
                                <div key={f} className="flex items-center gap-1.5 text-[12px] text-[#555]">
                                  <Check size={10} className="text-accent shrink-0" strokeWidth={3} />{f}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Strengths</p>
                            <div className="space-y-1.5">
                              {r.pros.map(p => (
                                <div key={p} className="flex items-center gap-1.5 text-[12px] text-[#555]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0" />{p}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Watch-outs</p>
                            <div className="space-y-1.5">
                              {r.cons.map(c => (
                                <div key={c} className="flex items-center gap-1.5 text-[12px] text-[#555]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0" />{c}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-black/6">
                          <Link href={`/checkout?product=${encodeURIComponent(r.name)}&price=72&billing=monthly`}
                            className="flex items-center gap-1.5 bg-accent text-white text-[12px] font-semibold px-4 py-2 rounded-sm hover:bg-accent-hover transition-colors">
                            Buy Now <ArrowRight size={11} />
                          </Link>
                          <Link href={`/software/product/${r.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-1.5 border border-black/10 text-black text-[12px] font-medium px-4 py-2 rounded-sm hover:bg-surface transition-colors">
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Recommended Next Steps</p>
                </div>
                <div className="p-5 space-y-3">
                  {REQ_NEXT_STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-[13px] text-[#555]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Strategy body ── */}
          {!isRequirements && (
            <>
              <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Business Profile</p>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {strProfile.map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Check size={13} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                      <div>
                        <p className="text-[11px] text-muted">{label}</p>
                        <p className="text-[13px] font-medium text-black">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Implementation Roadmap</p>
                <div className="space-y-4">
                  {STR_PHASES.map((ph, pi) => (
                    <div key={ph.phase} className="bg-white border border-black/8 rounded-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-black/8"
                        style={{ backgroundColor: ph.color + '0d' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                          style={{ backgroundColor: ph.color }}>{pi + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-black leading-tight">{ph.title}</p>
                          <p className="text-[11px]" style={{ color: ph.color }}>{ph.duration}</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-[13px] text-[#555] leading-[1.65] mb-4">{ph.goal}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-1">
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Key Actions</p>
                            <div className="space-y-1.5">
                              {ph.actions.map(a => (
                                <div key={a} className="flex items-start gap-1.5 text-[11px] text-[#555]">
                                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ph.color }} />{a}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Recommended Products</p>
                            <div className="space-y-1.5">
                              {ph.products.map(p => (
                                <span key={p} className="block text-[11px] font-medium px-2 py-1 rounded-sm border"
                                  style={{ color: ph.color, borderColor: ph.color + '30', backgroundColor: ph.color + '08' }}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Success KPIs</p>
                            <div className="space-y-1.5">
                              {ph.kpis.map(k => (
                                <div key={k} className="flex items-start gap-1.5 text-[11px] text-[#555]">
                                  <Star size={9} className="mt-1 shrink-0" style={{ color: ph.color }} />{k}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Indicative Investment</p>
                </div>
                <div className="p-5 space-y-2.5">
                  {STR_INVESTMENT.map(({ item, cost }) => (
                    <div key={item} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                      <p className="text-[13px] text-[#555]">{item}</p>
                      <p className="text-[13px] font-semibold text-black">{cost}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer CTA */}
          <div className="bg-black rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-white mb-1">Ready to move forward?</p>
              <p className="text-[12px] text-white/60">Your Customer Success Manager is available to guide your procurement journey.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/software"
                className="flex items-center gap-1.5 bg-accent text-white text-[12px] font-semibold px-4 py-2.5 rounded-sm hover:bg-accent-hover transition-colors">
                <Package size={12} /> Browse Software
              </Link>
              <a href="mailto:success@zoftware.com"
                className="flex items-center gap-1.5 border border-white/20 text-white text-[12px] font-medium px-4 py-2.5 rounded-sm hover:bg-white/10 transition-colors">
                Talk to us
              </a>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ── Wizard view ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8faff]">

      {/* Header + progress */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-black/8">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-3 pb-2.5">
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <Link href="/software" className="flex items-center gap-1.5 text-[12px] text-muted hover:text-black transition-colors">
              <ArrowLeft size={13} /> Back to Software
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: isRequirements ? 'linear-gradient(135deg,#007AFF,#0051D5)' : 'linear-gradient(135deg,#0051D5,#003CA6)' }}>
                {isRequirements ? <FileText size={9} className="text-white" /> : <BarChart2 size={9} className="text-white" />}
              </div>
              <span className="text-[12px] font-semibold text-black">
                {isRequirements ? 'Tech Requirements Builder' : 'Tech Strategy Builder'}
              </span>
              <span className="text-[11px] text-muted">· {answeredCount}/{QUESTIONS.length}</span>
            </div>
          </div>
          <div className="h-1 bg-[#f0f0f0] rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-5 items-start">

          {/* Chat column */}
          <div className="space-y-4">
            {messages.map((msg, mi) => {
              const botsBefore = messages.slice(0, mi + 1).filter(m => m.from === 'bot').length;
              const q = msg.from === 'bot' ? QUESTIONS[botsBefore - 1] : null;
              const isLocked = q ? lockedQs.has(q.key) : false;

              return (
                <div key={msg.id}>
                  {msg.from === 'bot' ? (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ background: isRequirements ? 'linear-gradient(135deg,#007AFF,#0051D5)' : 'linear-gradient(135deg,#0051D5,#003CA6)' }}>
                        AI
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white border border-black/8 rounded-sm px-4 py-3 inline-block max-w-full">
                          <p className="text-[13px] text-black leading-[1.6]">{msg.text}</p>
                        </div>
                        {q && (
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {q.quickReplies.map(reply => (
                              <button
                                key={reply}
                                onClick={() => handleReply(q.key, reply)}
                                disabled={isLocked}
                                className={`text-[12px] px-3 py-1.5 rounded-full border transition-all ${
                                  isLocked && answers[q.key] === reply
                                    ? 'bg-accent text-white border-accent font-medium'
                                    : isLocked
                                    ? 'border-black/8 text-black/25 cursor-not-allowed'
                                    : 'bg-white border-black/12 text-[#333] hover:border-accent hover:text-accent cursor-pointer'
                                }`}
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="bg-accent text-white text-[13px] px-4 py-2.5 rounded-sm max-w-[70%]">
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: isRequirements ? 'linear-gradient(135deg,#007AFF,#0051D5)' : 'linear-gradient(135deg,#0051D5,#003CA6)' }}>
                  AI
                </div>
                <div className="bg-white border border-black/8 rounded-sm px-4 py-3.5 inline-block">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#bbb] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Sidebar — answers panel */}
          <div className="hidden lg:block">
            <div className="sticky top-[68px] bg-white border border-black/8 rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-black/8 bg-[#f9fafb]">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Your answers</p>
              </div>
              <div className="p-3 space-y-2.5">
                {QUESTIONS.map(q => (
                  <div key={q.key} className="flex items-start gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 flex items-center justify-center border ${
                      answers[q.key] ? 'bg-accent border-accent' : 'bg-white border-black/12'
                    }`}>
                      {answers[q.key] && <Check size={8} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted leading-tight">{q.label}</p>
                      <p className={`text-[11px] leading-snug mt-0.5 ${answers[q.key] ? 'font-medium text-black' : 'text-black/25 italic'}`}>
                        {answers[q.key] || 'Pending…'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {answeredCount === QUESTIONS.length && (
                <div className="p-3 border-t border-black/8">
                  <button
                    onClick={() => { setPhase('generating'); setTimeout(() => setPhase('report'), 2200); }}
                    className="w-full bg-accent text-white text-[12px] font-semibold py-2.5 rounded-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5">
                    Generate Report <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
