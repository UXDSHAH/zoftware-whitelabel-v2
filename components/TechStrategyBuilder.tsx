'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ArrowRight, Check, BarChart2, User, Sparkles, X, RefreshCw, Clock } from 'lucide-react';
import Link from 'next/link';

type MsgRole = 'bot' | 'user';
type Message = { role: MsgRole; text: string; stepId?: string };
type Step = { id: string; question: string; field: string; options?: string[]; multi?: boolean };

const COMMON: Step[] = [
  { id: 'role', question: 'What best describes **your role**?', field: 'role', options: ['CEO / Founder', 'CMO', 'CTO / Head of IT', 'CFO / Finance Head', 'HR / People Leader', 'Operations / PMO'] },
  { id: 'industry', question: 'What industry are you in?', field: 'industry', options: ['Retail / Ecommerce', 'Manufacturing / Trading', 'BFSI / FinTech', 'SaaS / Tech', 'Services / Consulting', 'Real Estate / Construction'] },
  { id: 'company_size', question: 'What is your **company size**?', field: 'company_size', options: ['Less than 50', '50–200', '200–1,000', '1,000+'] },
  { id: 'function', question: 'Which area would you like a **tech strategy** for?', field: 'function', options: ['ERP & Core Operations', 'MarTech & Customer Experience', 'Finance & Accounts', 'HR & People Systems'] },
];

const BRANCHES: Record<string, Step[]> = {
  'ERP & Core Operations': [
    { id: 'erp_objective', question: "What's your **primary ERP objective**?", field: 'erp_objective', options: ['Replace manual / Excel processes', 'Unify finance, sales & operations', 'Get real-time visibility', 'Support scale / multi-entity growth'] },
    { id: 'erp_break', question: 'Where does work **break down** most today?', field: 'erp_break', options: ['Order to Cash', 'Procure to Pay', 'Inventory & fulfilment', 'Reporting & approvals'] },
    { id: 'erp_current', question: 'How would you describe your **current ERP setup**?', field: 'erp_current', options: ['No ERP — mostly Excel', 'ERP exists but is underused', 'ERP is heavily customised', 'Multiple ERPs / disconnected systems'] },
    { id: 'erp_frustration', question: "What's your **biggest ERP frustration** right now?", field: 'erp_frustration', options: ['Data does not match reality', 'Teams bypass the system', 'Reporting is slow or unreliable', 'Implementation stalled or failed'] },
    { id: 'erp_criticality', question: 'How **critical** is this issue to your business today?', field: 'erp_criticality', options: ['Annoying but manageable', 'Slowing our growth', 'Creating operational risk', 'Blocking scale entirely'] },
    { id: 'erp_freetext', question: 'In one line — **where does your team lose the most time or confidence today?**\n\n*(e.g. approvals, data fixes, reconciliations)*', field: 'erp_freetext' },
  ],
  'MarTech & Customer Experience': [
    { id: 'martech_objective', question: "What's your **main MarTech objective**?", field: 'martech_objective', options: ['Improve lead quality & conversion', 'Personalise customer journeys', 'Improve retention / repeat revenue', 'Get better attribution & ROI'] },
    { id: 'martech_break', question: 'Where does the **customer journey break** today?', field: 'martech_break', options: ['Ads to website', 'Website to WhatsApp / Sales', 'Sales to support', 'Post-purchase / retention'] },
    { id: 'martech_stack', question: 'How does your **MarTech stack feel** today?', field: 'martech_stack', options: ["Too many tools, low clarity", "Tools don't talk to each other", 'Automation exists but feels limited', 'Mostly manual processes'] },
    { id: 'martech_frustration', question: "What's your **biggest MarTech frustration**?", field: 'martech_frustration', options: ['Attribution is unclear', 'Handoffs lose context', 'Reporting takes too long', 'Personalisation is weak'] },
    { id: 'martech_data', question: 'How **visible is customer data** across teams?', field: 'martech_data', options: ['Fully shared', 'Partially shared', 'Mostly siloed', 'No single view exists'] },
    { id: 'martech_freetext', question: 'What **frustrates your team most** about the current customer journey?\n\n*(Type freely — any detail helps)*', field: 'martech_freetext' },
  ],
  'Finance & Accounts': [
    { id: 'finance_priority', question: "What's your **top finance priority**?", field: 'finance_priority', options: ['Faster month-end close', 'Better cashflow visibility', 'Automate AP / AR', 'Improve forecasting & control'] },
    { id: 'finance_struggle', question: 'Where does finance **struggle most**?', field: 'finance_struggle', options: ['Manual entries & reconciliations', 'Delayed / inaccurate reports', 'Collections are reactive', 'Data mismatch with sales / ops'] },
    { id: 'finance_systems', question: 'How **mature are your finance systems** today?', field: 'finance_systems', options: ['Accounting software + Excel', 'ERP finance module', 'Separate FP&A tools', 'Mostly manual / spreadsheets'] },
    { id: 'finance_uncertainty', question: 'What **causes the most uncertainty** today?', field: 'finance_uncertainty', options: ['Cash position', 'Profitability by segment', 'Forecast accuracy', 'Close timelines'] },
    { id: 'finance_manual', question: 'How **dependent** is your finance function on manual work?', field: 'finance_manual', options: ['Low — mostly automated', 'Medium — some manual steps', 'High — lots of manual work', 'Critical risk — almost all manual'] },
    { id: 'finance_freetext', question: 'What **keeps you guessing or double-checking** most in finance today?\n\n*(e.g. cash position, cost allocations, close dates)*', field: 'finance_freetext' },
  ],
  'HR & People Systems': [
    { id: 'hr_objective', question: "What's your **main HR objective**?", field: 'hr_objective', options: ['Standardise HR operations', 'Improve payroll & compliance', 'Improve hiring & onboarding', 'Improve performance & retention'] },
    { id: 'hr_break', question: 'Where does **HR break down** most often?', field: 'hr_break', options: ['Payroll errors / policy confusion', 'Manual onboarding & documents', 'Inconsistent performance reviews', 'Low visibility on attrition risk'] },
    { id: 'hr_systems', question: 'How are **HR systems set up** today?', field: 'hr_systems', options: ['Excel + emails', 'HRMS + payroll system', 'Multiple HR tools (fragmented)', 'Tools exist but adoption is low'] },
    { id: 'hr_struggles', question: 'Who **struggles most** with HR today?', field: 'hr_struggles', options: ['Employees', 'Managers', 'HR team', 'Finance / leadership'] },
    { id: 'hr_risk', question: 'How **risky** is the current HR setup?', field: 'hr_risk', options: ['Low risk — minor inefficiency', 'Efficiency issue affecting speed', 'Compliance risk (legal exposure)', 'Retention risk — people are leaving'] },
    { id: 'hr_freetext', question: "What's the **one HR issue managers complain about most**?\n\n*(e.g. leave approvals, performance tracking)*", field: 'hr_freetext' },
  ],
};

const FIELD_LABELS: Record<string, string> = {
  role: 'Your role', industry: 'Industry', company_size: 'Company size', function: 'Strategy area',
  erp_objective: 'ERP objective', erp_break: 'Biggest breakdown', erp_current: 'Current setup', erp_frustration: 'Main frustration', erp_criticality: 'Business criticality', erp_freetext: 'Time/confidence loss',
  martech_objective: 'MarTech objective', martech_break: 'Journey break', martech_stack: 'Stack feeling', martech_frustration: 'Main frustration', martech_data: 'Data visibility', martech_freetext: 'Team frustration',
  finance_priority: 'Finance priority', finance_struggle: 'Biggest struggle', finance_systems: 'System maturity', finance_uncertainty: 'Main uncertainty', finance_manual: 'Manual dependency', finance_freetext: 'Double-checking',
  hr_objective: 'HR objective', hr_break: 'HR breakdown', hr_systems: 'HR setup', hr_struggles: 'Who struggles', hr_risk: 'Risk level', hr_freetext: 'Manager complaints',
};

type Rec = { phase: string; color: string; title: string; body: string; products: string[]; bundleSlug?: string };

function buildStrategy(answers: Record<string, string>, fn: string): Rec[] {
  const size = answers.company_size || '';
  const isSmall = size.includes('50');
  const isEnterprise = size.includes('1,000');
  const bundleSlug = isSmall ? 'starter' : isEnterprise ? 'expansion' : 'growth';

  const base: Record<string, Rec[]> = {
    'ERP & Core Operations': [
      { phase: 'Phase 1 — Stabilise', color: '#007AFF', title: 'Unify your data foundation', body: 'Based on your answers, the priority is eliminating the gap between data and reality. Start by consolidating core operations onto a single ERP platform.', products: isEnterprise ? ['SAP S/4HANA', 'Oracle ERP Cloud'] : ['Odoo', 'Microsoft Dynamics 365', 'NetSuite'] },
      { phase: 'Phase 2 — Automate', color: '#0051D5', title: 'Connect and automate workflows', body: 'Once data is centralised, add automation for approvals, reporting, and inter-team handoffs to eliminate manual bottlenecks.', products: ['Zoho Books', 'QuickBooks', 'Freshservice'], bundleSlug },
      { phase: 'Phase 3 — Optimise', color: '#000000', title: 'Add intelligence and scale', body: 'Layer in BI and predictive analytics to move from reactive reporting to proactive decision-making.', products: ['Power BI', 'Tableau', 'Looker'] },
    ],
    'MarTech & Customer Experience': [
      { phase: 'Phase 1 — Connect', color: '#007AFF', title: 'Fix the handoff between channels', body: 'The customer journey is breaking at the handoff points you identified. Start by unifying your CRM and support into a single customer view.', products: ['Freshchat', 'HubSpot CRM', 'Freshsales'], bundleSlug },
      { phase: 'Phase 2 — Personalise', color: '#0051D5', title: 'Activate customer data', body: 'With a unified view, build personalised journeys — triggered emails, WhatsApp sequences, and behavioural targeting.', products: ['Klaviyo', 'ActiveCampaign', 'Mailchimp'] },
      { phase: 'Phase 3 — Measure', color: '#000000', title: 'Attribution and ROI clarity', body: "Add analytics to understand what's actually driving revenue and cut campaigns that aren't converting.", products: ['Mixpanel', 'Amplitude', 'Semrush'] },
    ],
    'Finance & Accounts': [
      { phase: 'Phase 1 — Visibility', color: '#007AFF', title: 'Get real-time financial visibility', body: 'Replace manual processes with a cloud accounting platform that shows live cash position, AR aging, and P&L — no spreadsheets.', products: ['Zoho Books', 'QuickBooks', 'Xero'] },
      { phase: 'Phase 2 — Automate', color: '#0051D5', title: 'Automate AP/AR and close', body: 'Automate recurring invoices, payment reminders, and bank reconciliation to cut close time and reduce errors.', products: ['FreshBooks', 'Sage Business Cloud', 'Wave'] },
      { phase: 'Phase 3 — Forecast', color: '#000000', title: 'Add forecasting and control', body: 'Layer in FP&A tools for scenario modelling, budget vs actual, and cash flow forecasting.', products: ['NetSuite', 'Power BI', 'Tableau'] },
    ],
    'HR & People Systems': [
      { phase: 'Phase 1 — Standardise', color: '#007AFF', title: 'Centralise employee records and leave', body: 'Replace Excel and email with a proper HRMS that gives employees self-service and gives HR real visibility.', products: ['Zoho People', 'BambooHR', 'Rippling'], bundleSlug },
      { phase: 'Phase 2 — Automate', color: '#0051D5', title: 'Automate payroll and onboarding', body: 'Once records are clean, automate the high-friction processes — payroll, onboarding checklists, and leave approvals.', products: ['Gusto', 'Workday HCM', 'Lattice'] },
      { phase: 'Phase 3 — Retain', color: '#000000', title: 'Performance and retention', body: 'Add performance management, pulse surveys, and attrition risk scoring to keep your best people engaged.', products: ['15Five', 'Lattice', 'BambooHR'] },
    ],
  };
  return base[fn] || base['ERP & Core Operations'];
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return <>{parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>)}</>;
}

export default function TechStrategyBuilder({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hi! I'll build a **personalised tech strategy** for your business in under 2 minutes.\n\nI'll ask a few questions, then give you a phased roadmap. Let's begin:", stepId: 'intro' },
    { role: 'bot', text: COMMON[0].question, stepId: COMMON[0].id },
  ]);
  const [stepQueue, setStepQueue] = useState<Step[]>(COMMON.slice(1));
  const [currentStep, setCurrentStep] = useState<Step>(COMMON[0]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [extraContext, setExtraContext] = useState('');
  const [strategy, setStrategy] = useState<Rec[]>([]);
  const [chosenFunction, setChosenFunction] = useState('');

  // ── Idle detection ──────────────────────────────────────────────────────
  const [showIdleNudge, setShowIdleNudge] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const IDLE_SECONDS = 22;

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowIdleNudge(false);
  }, []);

  useEffect(() => {
    if (done || reviewing) return;
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_SECONDS * 1000) {
        setShowIdleNudge(true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [done, reviewing]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const isLastMsg = (i: number) => i === messages.length - 1;
  const totalSteps = COMMON.length + (BRANCHES[chosenFunction]?.length || 6);
  const currentIdx = Object.keys(answers).length;

  const advance = (answer: string) => {
    resetActivity();
    setMessages(m => [...m, { role: 'user', text: answer }]);
    const newAnswers = { ...answers, [currentStep.field]: answer };
    setAnswers(newAnswers);
    setInput('');

    let nextQueue = [...stepQueue];
    if (currentStep.id === 'function') {
      const branch = BRANCHES[answer] || [];
      nextQueue = [...branch, ...nextQueue];
      setChosenFunction(answer);
    }

    if (nextQueue.length === 0) {
      // ── Review step before generating roadmap ──
      setAnswers(newAnswers);
      setReviewing(true);
      setTimeout(() => {
        const fn = newAnswers.function || chosenFunction || answer;
        const summary = Object.entries(newAnswers)
          .filter(([k]) => FIELD_LABELS[k])
          .map(([k, v]) => `• **${FIELD_LABELS[k]}:** ${v}`)
          .join('\n');
        setMessages(m => [...m, {
          role: 'bot',
          text: `Here's a summary of your inputs for the **${fn}** strategy:\n\n${summary}\n\nAnything you'd like to add or change before I generate your roadmap?`,
          stepId: 'review',
        }]);
      }, 300);
    } else {
      const next = nextQueue[0];
      setCurrentStep(next);
      setStepQueue(nextQueue.slice(1));
      setTimeout(() => setMessages(m => [...m, { role: 'bot', text: next.question, stepId: next.id }]), 200);
    }
  };

  const generateRoadmap = (extra?: string) => {
    resetActivity();
    if (extra?.trim()) setMessages(m => [...m, { role: 'user', text: extra.trim() }]);
    const fn = answers.function || chosenFunction;
    const strat = buildStrategy(answers, fn);
    setStrategy(strat);
    setReviewing(false);
    setDone(true);
    setTimeout(() => setMessages(m => [...m, {
      role: 'bot',
      text: `✅ Your **${fn}** tech strategy is ready — here's a phased roadmap based on your answers:`,
      stepId: 'result',
    }]), 200);
  };

  const handleReset = () => {
    setMessages([
      { role: 'bot', text: "Hi! I'll build a **personalised tech strategy** for your business in under 2 minutes.\n\nI'll ask a few questions, then give you a phased roadmap. Let's begin:", stepId: 'intro' },
      { role: 'bot', text: COMMON[0].question, stepId: COMMON[0].id },
    ]);
    setStepQueue(COMMON.slice(1)); setCurrentStep(COMMON[0]); setAnswers({});
    setInput(''); setDone(false); setReviewing(false);
    setStrategy([]); setChosenFunction(''); setExtraContext(''); resetActivity();
  };

  return (
    <div className="flex flex-col bg-white h-full" style={{ minHeight: '500px', maxHeight: '72vh' }}>

      {/* Progress bar */}
      {!done && !reviewing && (
        <div className="h-0.5 bg-surface">
          <div className="h-full bg-accent transition-all"
            style={{ width: `${Math.round((currentIdx / totalSteps) * 100)}%` }} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        onMouseMove={resetActivity} onKeyDown={resetActivity} onTouchStart={resetActivity}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
              {msg.role === 'bot' ? <BarChart2 size={13} className="text-white" strokeWidth={1.5} /> : <User size={13} className="text-white" strokeWidth={1.5} />}
            </div>
            <div className={`flex flex-col gap-2 max-w-[84%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-3.5 py-2.5 text-[13px] leading-[1.65] whitespace-pre-line rounded-2xl ${
                msg.role === 'bot' ? 'bg-surface text-black rounded-tl-sm' : 'bg-accent text-white rounded-tr-sm'
              }`}>
                <RichText text={msg.text} />
              </div>

              {/* Regular question options */}
              {msg.role === 'bot' && msg.stepId && isLastMsg(i) && !done && !reviewing && currentStep.options && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentStep.options.map(opt => (
                    <button key={opt} onClick={() => advance(opt)}
                      className="text-[12px] font-medium border border-accent/30 text-accent bg-white px-3 py-1.5 rounded-full hover:bg-accent/8 hover:border-accent/60 transition-all">
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Review step CTA */}
              {msg.role === 'bot' && msg.stepId === 'review' && reviewing && isLastMsg(i) && (
                <div className="w-full mt-1 space-y-2">
                  <button onClick={() => generateRoadmap()}
                    className="flex items-center gap-2 bg-accent text-white text-[12px] font-semibold px-4 py-2.5 rounded-sm hover:bg-accent-hover transition-colors">
                    <Sparkles size={13} /> Looks good — generate my roadmap
                  </button>
                  <p className="text-[11px] text-muted">Or add any extra context below and hit send</p>
                </div>
              )}

              {/* Strategy output */}
              {msg.role === 'bot' && msg.stepId === 'result' && done && strategy.length > 0 && (
                <div className="w-full space-y-3 mt-1">
                  {strategy.map(phase => (
                    <div key={phase.phase} className="border border-black/8 rounded-sm overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/8" style={{ backgroundColor: phase.color + '10' }}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: phase.color }} />
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: phase.color }}>{phase.phase}</p>
                        {phase.bundleSlug && (
                          <Link href={`/bundles/${phase.bundleSlug}`} onClick={onClose}
                            className="ml-auto text-[9px] font-bold text-white px-2 py-0.5 rounded-sm" style={{ backgroundColor: phase.color }}>
                            Bundle available →
                          </Link>
                        )}
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[13px] font-semibold text-black mb-1">{phase.title}</p>
                        <p className="text-[12px] text-[#555] leading-[1.6] mb-2.5">{phase.body}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.products.map(p => (
                            <span key={p} className="text-[11px] font-medium border px-2 py-0.5 rounded-sm"
                              style={{ color: phase.color, borderColor: phase.color + '30', backgroundColor: phase.color + '08' }}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Link href="/software/report/strategy" onClick={onClose}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-white text-[12px] font-semibold py-2.5 rounded-sm hover:bg-accent-hover transition-colors">
                      <Sparkles size={12} /> View Full Roadmap
                    </Link>
                    <Link href="/software?view=bundles" onClick={onClose}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-black/10 text-black text-[12px] font-medium py-2.5 rounded-sm hover:bg-surface transition-colors">
                      View bundles <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Idle nudge */}
      {showIdleNudge && !done && (
        <div className="mx-4 mb-2 flex items-center gap-3 bg-black text-white px-4 py-2.5 rounded-sm text-[12px] shadow-lg">
          <Clock size={14} className="text-accent shrink-0 animate-pulse" />
          <span className="flex-1">Still there? Need a hand with your strategy? <span className="text-accent font-semibold">We can help.</span></span>
          <button onClick={resetActivity} className="text-white/50 hover:text-white transition-colors shrink-0"><X size={13} /></button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-black/8 bg-white p-3">
        {!done ? (
          <>
            <div className="flex items-center gap-2">
              <input
                value={reviewing ? extraContext : input}
                onChange={e => { resetActivity(); reviewing ? setExtraContext(e.target.value) : setInput(e.target.value); }}
                onKeyDown={e => {
                  resetActivity();
                  if (e.key === 'Enter') {
                    if (reviewing && extraContext.trim()) generateRoadmap(extraContext);
                    else if (!reviewing && input.trim()) advance(input.trim());
                  }
                }}
                placeholder={reviewing ? 'Add any extra context… (optional)' : (!currentStep.options ? 'Type your answer…' : 'Or type your own answer…')}
                className="flex-1 bg-surface border-0 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-accent/20 placeholder-muted"
              />
              <button
                onClick={() => {
                  if (reviewing) { if (extraContext.trim()) generateRoadmap(extraContext); else generateRoadmap(); }
                  else if (input.trim()) advance(input.trim());
                }}
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white hover:opacity-90 transition-opacity shrink-0">
                <Send size={14} strokeWidth={2} />
              </button>
            </div>
            {!reviewing && (
              <p className="text-[10px] text-muted mt-1.5 text-center">
                {currentIdx} of ~{totalSteps} questions · Choose above or type freely
              </p>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1.5 text-[12px] text-muted hover:text-black py-2 transition-colors">
              <RefreshCw size={11} /> Start over
            </button>
            <button onClick={onClose}
              className="flex-1 bg-accent text-white text-[12px] font-semibold py-2.5 rounded-sm hover:opacity-90 transition-opacity">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
