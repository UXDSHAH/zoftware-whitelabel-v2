'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Download, FileText, BarChart2, Check, ArrowRight,
  Building2, Calendar, Users, Shield, Zap, Package, Star
} from 'lucide-react';

// ── Requirement report mock data ──────────────────────────────────────────
const requirementsReport = {
  title: 'Tech Requirements Report',
  subtitle: 'Software Procurement RFP — Gulf Enterprises LLC',
  generatedOn: 'June 2026',
  company: 'Gulf Enterprises LLC',
  preparedBy: 'Software Gateway · Powered by Zoftware',
  inputs: [
    { label: 'Purpose', value: 'Replacement — existing CRM is underused' },
    { label: 'Data Migration', value: 'Yes — migration from existing system required' },
    { label: 'Team Size', value: '50–200 users' },
    { label: 'Annual Budget', value: '$25,000–$75,000' },
    { label: 'Deployment', value: 'SaaS / Cloud' },
    { label: 'Go-live Timeline', value: '1–3 months' },
    { label: 'Integrations Needed', value: 'Yes — CRM, ERP, Email / Calendar, Payments' },
    { label: 'Company Type', value: 'SME — Small & Medium Enterprises' },
    { label: 'Local Vendor Preference', value: 'Yes — important for support' },
    { label: 'Compliance', value: 'ISO 27001 / SOC 2' },
    { label: 'Key Challenge', value: 'We lose leads because there is no central place to track them' },
  ],
  recommendations: [
    {
      rank: 1, name: 'Freshsales', vendor: 'Freshworks', category: 'CRM & Sales',
      logo: 'FS', score: 94, label: 'Excellent Match',
      price: '$72/user/mo', annualTotal: '$86,400/yr (10 users)',
      reason: 'AI-powered CRM with built-in telephony, email sequences, and deal pipeline. GCC data residency. 7-day activation.',
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
  ],
  nextSteps: [
    'Schedule demos with shortlisted vendors (Freshsales, Zoho CRM)',
    'Request GCC data residency confirmation from vendor',
    'Confirm data migration scope and timeline with IT team',
    'Define user roles and permission structure before procurement',
    'Negotiate multi-year pricing for 20%+ additional savings',
  ],
};

// ── Strategy report mock data ─────────────────────────────────────────────
const strategyReport = {
  title: 'Tech Strategy Roadmap',
  subtitle: 'ERP & Core Operations — Gulf Enterprises LLC',
  generatedOn: 'June 2026',
  company: 'Gulf Enterprises LLC',
  function: 'ERP & Core Operations',
  preparedBy: 'Software Gateway · Powered by Zoftware',
  profile: [
    { label: 'Role', value: 'CTO / Head of IT' },
    { label: 'Industry', value: 'Manufacturing / Trading' },
    { label: 'Company Size', value: '50–200 employees' },
    { label: 'Primary Objective', value: 'Unify finance, sales & operations' },
    { label: 'Biggest Breakdown', value: 'Reporting & approvals' },
    { label: 'Current Setup', value: 'ERP exists but is heavily customised' },
    { label: 'Business Criticality', value: 'Slowing our growth' },
  ],
  phases: [
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
  ],
  investment: [
    { item: 'ERP Licences (20 users, annual)', cost: '$24,000–$48,000/yr' },
    { item: 'Implementation Partner', cost: '$15,000–$40,000 one-time' },
    { item: 'BI Tools', cost: '$3,000–$8,000/yr' },
    { item: 'Training & Change Management', cost: '$5,000–$10,000 one-time' },
    { item: 'Managed Support (optional)', cost: '$2,400/yr' },
  ],
};

export default function ReportPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const isRequirements = type === 'requirements';
  const report = isRequirements ? requirementsReport : strategyReport;

  return (
    <div className="min-h-screen bg-[#f8faff]">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-black/8">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/software"
              className="flex items-center gap-1.5 text-[12px] text-muted hover:text-black transition-colors">
              <ArrowLeft size={13} /> Back to Software
            </Link>
            <span className="text-[#e5e5e7]">|</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: isRequirements ? 'linear-gradient(135deg,#007AFF,#0051D5)' : 'linear-gradient(135deg,#0051D5,#003CA6)' }}>
                {isRequirements ? <FileText size={12} className="text-white" /> : <BarChart2 size={12} className="text-white" />}
              </div>
              <span className="text-[13px] font-semibold text-black">{report.title}</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-accent px-3 py-1.5 rounded-sm hover:bg-accent-hover transition-colors">
            <Download size={12} /> Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Report header ── */}
        <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/8"
            style={{ background: isRequirements ? 'linear-gradient(135deg, #eff6ff, #f8fbff)' : 'linear-gradient(135deg, #eef2ff, #f8fbff)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: isRequirements ? 'linear-gradient(135deg,#007AFF,#0051D5)' : 'linear-gradient(135deg,#0051D5,#003CA6)' }}>
                    {isRequirements ? <FileText size={14} className="text-white" /> : <BarChart2 size={14} className="text-white" />}
                  </div>
                  <span className="text-[11px] font-bold text-accent uppercase tracking-[0.1em]">
                    {isRequirements ? 'Tech Requirements Report' : 'Tech Strategy Roadmap'}
                  </span>
                </div>
                <h1 className="text-[22px] sm:text-[26px] font-semibold text-black tracking-tight mb-1">
                  {report.subtitle}
                </h1>
                <p className="text-[13px] text-muted">{report.preparedBy}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-muted">Generated</p>
                <p className="text-[13px] font-semibold text-black">{report.generatedOn}</p>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-black/6 border-b border-black/8">
            {[
              { icon: <Building2 size={12} />, label: 'Company', value: report.company },
              { icon: <Calendar size={12} />, label: 'Generated', value: report.generatedOn },
              { icon: isRequirements ? <Users size={12} /> : <Zap size={12} />, label: isRequirements ? 'Scope' : 'Focus area', value: isRequirements ? '50–200 users' : (strategyReport as typeof strategyReport).function },
              { icon: <Shield size={12} />, label: 'Confidential', value: 'Internal use only' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-muted mb-0.5">{icon}<span className="text-[10px]">{label}</span></div>
                <p className="text-[12px] font-semibold text-black truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Requirements report body ── */}
        {isRequirements && (
          <>
            {/* Inputs summary */}
            <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Requirements Summary</p>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {requirementsReport.inputs.map(({ label, value }) => (
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

            {/* Recommendations */}
            <div>
              <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Software Recommendations</p>
              <div className="space-y-4">
                {requirementsReport.recommendations.map(r => (
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
                        <Link href={`/software/product/${r.name.toLowerCase().replace(/\s+/g,'-')}`}
                          className="flex items-center gap-1.5 border border-black/10 text-black text-[12px] font-medium px-4 py-2 rounded-sm hover:bg-surface transition-colors">
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Recommended Next Steps</p>
              </div>
              <div className="p-5 space-y-3">
                {requirementsReport.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-[13px] text-[#555]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Strategy report body ── */}
        {!isRequirements && (
          <>
            {/* Profile */}
            <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Business Profile</p>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strategyReport.profile.map(({ label, value }) => (
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

            {/* Phases */}
            <div>
              <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Implementation Roadmap</p>
              <div className="space-y-4">
                {strategyReport.phases.map((phase, pi) => (
                  <div key={phase.phase} className="bg-white border border-black/8 rounded-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-black/8"
                      style={{ backgroundColor: phase.color + '0d' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                        style={{ backgroundColor: phase.color }}>{pi + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-black leading-tight">{phase.title}</p>
                        <p className="text-[11px]" style={{ color: phase.color }}>{phase.duration}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-[13px] text-[#555] leading-[1.65] mb-4">{phase.goal}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Key Actions</p>
                          <div className="space-y-1.5">
                            {phase.actions.map(a => (
                              <div key={a} className="flex items-start gap-1.5 text-[11px] text-[#555]">
                                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: phase.color }} />{a}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Recommended Products</p>
                          <div className="space-y-1.5">
                            {phase.products.map(p => (
                              <span key={p} className="block text-[11px] font-medium px-2 py-1 rounded-sm border"
                                style={{ color: phase.color, borderColor: phase.color + '30', backgroundColor: phase.color + '08' }}>
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Success KPIs</p>
                          <div className="space-y-1.5">
                            {phase.kpis.map(k => (
                              <div key={k} className="flex items-start gap-1.5 text-[11px] text-[#555]">
                                <Star size={9} className="mt-1 shrink-0" style={{ color: phase.color }} />{k}
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

            {/* Investment */}
            <div className="bg-white border border-black/8 rounded-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-black/8 bg-[#f9fafb]">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Indicative Investment</p>
              </div>
              <div className="p-5 space-y-2.5">
                {strategyReport.investment.map(({ item, cost }) => (
                  <div key={item} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                    <p className="text-[13px] text-[#555]">{item}</p>
                    <p className="text-[13px] font-semibold text-black">{cost}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Footer CTA ── */}
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
