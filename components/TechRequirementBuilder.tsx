'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Download, ArrowRight, Check, FileText, User, X, RefreshCw, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

type MsgRole = 'bot' | 'user';
type Message = { role: MsgRole; text: string; stepId?: string };
type StepType = 'single' | 'multi' | 'text' | 'branch';
type Step = {
  id: string; question: string; type: StepType;
  options?: string[]; field: string; placeholder?: string;
  branchTrigger?: string; branchStep?: Step;
};

const STEPS: Step[] = [
  {
    id: 'tool_type',
    question: "Is this a **new tool** you're adding, or a **replacement** for something you already have?",
    type: 'branch', field: 'tool_type',
    options: ['New tool', 'Replacement'],
    branchTrigger: 'Replacement',
    branchStep: {
      id: 'data_migration',
      question: 'Will you need **data migration** from your existing system?',
      type: 'single', field: 'data_migration',
      options: ['Yes', 'No', 'Not sure yet'],
    },
  },
  {
    id: 'team_size', question: 'How many people will be using this software?',
    type: 'single', field: 'team_size',
    options: ['1–10 users', '10–50 users', '50–200 users', 'More than 200 users'],
  },
  {
    id: 'budget', question: 'What is your **annual software budget** for this (in USD)?',
    type: 'single', field: 'budget',
    options: ['Less than $5,000', '$5,000–$25,000', '$25,000–$75,000', '$75,000–$200,000', 'More than $200,000'],
  },
  {
    id: 'deployment', question: 'Which deployment model do you prefer?',
    type: 'single', field: 'deployment',
    options: ['SaaS / Cloud (recommended)', 'Private Cloud', 'On-Premises'],
  },
  {
    id: 'timeline', question: 'When do you need this live?',
    type: 'single', field: 'timeline',
    options: ['Within 2 weeks', 'Within 1 month', '1–3 months', 'Flexible — just exploring'],
  },
  {
    id: 'integrations',
    question: 'Do you need this software to **integrate** with other tools you already use?',
    type: 'branch', field: 'integrations',
    options: ['Yes', 'No', 'Not sure yet'],
    branchTrigger: 'Yes',
    branchStep: {
      id: 'must_connect',
      question: 'Which systems must it connect with? *(Select all that apply)*',
      type: 'multi', field: 'must_connect',
      options: ['CRM', 'ERP', 'Accounting / Finance', 'Email / Calendar', 'SSO / Identity', 'E-commerce', 'Payments', 'Data Warehouse / BI', 'WhatsApp / Messaging', 'Other'],
    },
  },
  {
    id: 'company_type', question: 'How would you describe your company?',
    type: 'single', field: 'company_type',
    options: ['MSME — Micro, Small & Medium Enterprises', 'SME — Small & Medium Enterprises', 'Large Enterprise (500+ employees)'],
  },
  {
    id: 'local_vendor',
    question: 'Do you prefer a vendor with a **local office in the Middle East / GCC**?',
    type: 'single', field: 'local_vendor',
    options: ['Yes — important for support', 'No — remote is fine', 'Flexible'],
  },
  {
    id: 'compliance',
    question: 'Any specific **compliance or security standards** the software must meet?',
    type: 'single', field: 'compliance',
    options: ['GDPR / Data residency', 'ISO 27001 / SOC 2', 'HIPAA (healthcare)', 'PCI DSS (payments / fintech)', 'None / Not applicable'],
  },
  {
    id: 'pain_point',
    question: "Last one — in one sentence, what's the **biggest problem** you're trying to solve with this software?",
    type: 'text', field: 'pain_point',
    placeholder: "e.g. \"We lose leads because there's no central place to track them\"",
  },
];

const FIELD_LABELS: Record<string, string> = {
  tool_type: 'Purpose', data_migration: 'Data migration', team_size: 'Team size',
  budget: 'Budget', deployment: 'Deployment', timeline: 'Go-live timeline',
  integrations: 'Integrations needed', must_connect: 'Must connect with',
  company_type: 'Company type', local_vendor: 'Local vendor', compliance: 'Compliance',
  pain_point: 'Key challenge',
};

function matchProducts(answers: Record<string, string | string[]>) {
  const pool = [
    { name: 'Freshchat', slug: 'freshchat', category: 'Customer Support', price: '$46.55/user/mo', score: 92, label: 'Excellent Match', logo: 'FC', reason: 'AI-powered omnichannel messaging. Covers WhatsApp, email, chat. GCC-licensed.', features: ['Live chat & AI bots', 'Email & ticketing', 'Omnichannel routing', 'Role-based access'] },
    { name: 'Freshsales', slug: 'freshsales', category: 'CRM & Sales', price: '$72/user/mo', score: 89, label: 'Excellent Match', logo: 'FS', reason: 'AI-powered CRM with built-in phone, email, and activity timeline for GCC teams.', features: ['Pipeline management', 'AI lead scoring', 'Built-in calling', 'Custom reports'] },
    { name: 'Zoho CRM', slug: 'zoho-crm', category: 'CRM & Sales', price: '$21.85/user/mo', score: 84, label: 'Good Match', logo: 'ZC', reason: 'Cost-effective omnichannel CRM with Zia AI, deep Zoho ecosystem integration.', features: ['Contact management', 'Workflow automation', 'Zia AI insights', 'Multi-channel'] },
    { name: 'HubSpot CRM', slug: 'hubspot-crm', category: 'CRM & Sales', price: '$19/user/mo', score: 81, label: 'Good Match', logo: 'HS', reason: 'Marketing + sales CRM with a real free tier. Ideal if you need marketing automation too.', features: ['Free CRM tier', 'Email marketing', 'Deal tracking', 'Forms & landing pages'] },
    { name: 'Freshdesk', slug: 'freshdesk', category: 'Customer Support', price: '$52.25/user/mo', score: 86, label: 'Excellent Match', logo: 'FD', reason: '12,800+ reviews. Top-rated helpdesk with Freddy AI and omnichannel ticketing.', features: ['Multichannel ticketing', 'AI Copilot', 'Knowledge base', 'CSAT surveys'] },
  ];
  return pool.sort((a, b) => b.score - a.score).slice(0, 3);
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return <>{parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>)}</>;
}

export default function TechRequirementBuilder({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hi! I'll help you build a **Tech Requirements document** to find the right software for your business.\n\nAnswer a few quick questions — takes about 2 minutes. Let's start:", stepId: 'intro' },
    { role: 'bot', text: STEPS[0].question, stepId: STEPS[0].id },
  ]);
  const [stepQueue, setStepQueue] = useState<Step[]>(STEPS.slice(1));
  const [currentStep, setCurrentStep] = useState<Step>(STEPS[0]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [extraContext, setExtraContext] = useState('');
  const [results, setResults] = useState<ReturnType<typeof matchProducts>>([]);

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
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, done, reviewing]);

  const pushBot = (text: string, stepId?: string) => setMessages(m => [...m, { role: 'bot', text, stepId }]);
  const pushUser = (text: string) => setMessages(m => [...m, { role: 'user', text }]);

  const advance = (answer: string | string[]) => {
    resetActivity();
    const displayAnswer = Array.isArray(answer) ? answer.join(', ') : answer;
    pushUser(displayAnswer);
    const newAnswers = { ...answers, [currentStep.field]: answer };
    setAnswers(newAnswers);
    setSelected([]);

    let nextQueue = [...stepQueue];
    if (currentStep.type === 'branch' && currentStep.branchStep &&
      (Array.isArray(answer) ? answer[0] : answer) === currentStep.branchTrigger) {
      nextQueue = [currentStep.branchStep, ...nextQueue];
    }

    if (nextQueue.length === 0) {
      // ── Review step instead of jumping straight to results ──
      setAnswers(newAnswers);
      setReviewing(true);
      setTimeout(() => {
        const summary = Object.entries(newAnswers)
          .filter(([k]) => FIELD_LABELS[k])
          .map(([k, v]) => `• **${FIELD_LABELS[k]}:** ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n');
        pushBot(`Here's a summary of everything you've shared:\n\n${summary}\n\nWould you like to add anything before I generate your recommendations? Or just confirm and I'll match you now.`, 'review');
      }, 300);
    } else {
      const next = nextQueue[0];
      setCurrentStep(next);
      setStepQueue(nextQueue.slice(1));
      setTimeout(() => pushBot(next.question, next.id), 200);
    }
    setInput('');
  };

  const generateResults = (extra?: string) => {
    resetActivity();
    if (extra?.trim()) pushUser(extra.trim());
    const matched = matchProducts(answers);
    setResults(matched);
    setReviewing(false);
    setDone(true);
    setTimeout(() => pushBot(`✅ Done! Based on your inputs, here are your **top 3 software matches** with fit scores:`, 'results'), 200);
  };

  const toggleMulti = (opt: string) => { resetActivity(); setSelected(s => s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]); };
  const confirmMulti = () => { if (selected.length > 0) advance(selected); };
  const isLastMsg = (i: number) => i === messages.length - 1;

  const handleReset = () => {
    setMessages([
      { role: 'bot', text: "Hi! I'll help you build a **Tech Requirements document** to find the right software for your business.\n\nAnswer a few quick questions — takes about 2 minutes. Let's start:" },
      { role: 'bot', text: STEPS[0].question, stepId: STEPS[0].id },
    ]);
    setStepQueue(STEPS.slice(1)); setCurrentStep(STEPS[0]); setAnswers({});
    setSelected([]); setInput(''); setDone(false); setReviewing(false);
    setResults([]); setExtraContext(''); resetActivity();
  };

  return (
    <div className="flex flex-col bg-white h-full" style={{ minHeight: '500px', maxHeight: '72vh' }}>

      {/* ── Message thread ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        onMouseMove={resetActivity} onKeyDown={resetActivity} onTouchStart={resetActivity}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
              {msg.role === 'bot' ? <FileText size={13} className="text-white" strokeWidth={1.5} /> : <User size={13} className="text-white" strokeWidth={1.5} />}
            </div>
            <div className={`flex flex-col gap-2 max-w-[84%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-3.5 py-2.5 text-[13px] leading-[1.65] whitespace-pre-line rounded-2xl ${
                msg.role === 'bot' ? 'bg-surface text-black rounded-tl-sm' : 'bg-accent text-white rounded-tr-sm'
              }`}>
                <RichText text={msg.text} />
              </div>

              {/* ── Regular question options ── */}
              {msg.role === 'bot' && msg.stepId && isLastMsg(i) && !done && !reviewing && (
                <div className="w-full">
                  {(currentStep.type === 'single' || currentStep.type === 'branch') && currentStep.options && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {currentStep.options.map(opt => (
                        <button key={opt} onClick={() => advance(opt)}
                          className="text-[12px] font-medium border border-accent/25 text-accent bg-white px-3 py-1.5 rounded-full hover:bg-accent/8 hover:border-accent/50 transition-all">
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {currentStep.type === 'multi' && currentStep.options && (
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {currentStep.options.map(opt => (
                          <button key={opt} onClick={() => toggleMulti(opt)}
                            className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                              selected.includes(opt) ? 'bg-accent text-white border-accent' : 'border-accent/25 text-accent bg-white hover:bg-accent/8'
                            }`}>
                            {selected.includes(opt) && <Check size={10} strokeWidth={3} />}{opt}
                          </button>
                        ))}
                      </div>
                      {selected.length > 0 && (
                        <button onClick={confirmMulti}
                          className="flex items-center gap-2 bg-accent text-white text-[12px] font-semibold px-4 py-2 rounded-sm hover:opacity-90 transition-opacity">
                          <Check size={13} strokeWidth={2.5} /> Confirm {selected.length} selection{selected.length > 1 ? 's' : ''}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Review step CTA ── */}
              {msg.role === 'bot' && msg.stepId === 'review' && reviewing && isLastMsg(i) && (
                <div className="w-full mt-1 space-y-2">
                  <button onClick={() => generateResults()}
                    className="flex items-center gap-2 bg-accent text-white text-[12px] font-semibold px-4 py-2.5 rounded-sm hover:bg-accent-hover transition-colors">
                    <Sparkles size={13} /> Looks good — generate my recommendations
                  </button>
                  <p className="text-[11px] text-muted">Or type any extra context below and hit send</p>
                </div>
              )}

              {/* ── Results ── */}
              {msg.role === 'bot' && msg.stepId === 'results' && done && isLastMsg(i) && results.length > 0 && (
                <div className="w-full space-y-3 mt-1">
                  {results.map((r, ri) => (
                    <div key={r.slug} className="border border-black/8 rounded-sm overflow-hidden bg-white">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-black/8 bg-[#f9fafb]">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-bold text-muted w-5">#{ri + 1}</span>
                          <div className="w-8 h-8 rounded-sm bg-surface border border-black/8 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-black">{r.logo}</span>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-black">{r.name}</p>
                            <p className="text-[10px] text-muted">{r.category}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.score >= 90 ? 'bg-[#dcfce7] text-[#16a34a]' : r.score >= 80 ? 'bg-[#dbeafe] text-accent' : 'bg-surface text-muted'
                        }`}>{r.score}% {r.label}</span>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[12px] text-[#555] leading-[1.55] mb-2.5">{r.reason}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {r.features.map(f => (
                            <span key={f} className="flex items-center gap-1 text-[10px] text-[#555] bg-surface px-2 py-1 rounded-sm">
                              <Check size={8} className="text-accent" strokeWidth={3} />{f}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-black">{r.price}</span>
                          <Link href={`/software/product/${r.slug}`} onClick={onClose}
                            className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover transition-colors">
                            View details <ArrowRight size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <Link href="/software/report/requirements" onClick={onClose}
                      className="flex items-center gap-1.5 bg-accent text-white text-[11px] font-semibold px-3 py-2.5 rounded-sm hover:bg-accent-hover transition-colors">
                      <Download size={11} /> View Full Report
                    </Link>
                    <Link href="/software" onClick={onClose}
                      className="flex items-center gap-1.5 border border-black/10 text-black text-[11px] font-medium px-3 py-2.5 rounded-sm hover:bg-surface transition-colors">
                      Browse all software <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Idle nudge banner ── */}
      {showIdleNudge && !done && (
        <div className="mx-4 mb-2 flex items-center gap-3 bg-black text-white px-4 py-2.5 rounded-sm text-[12px] shadow-lg">
          <Clock size={14} className="text-accent shrink-0 animate-pulse" />
          <span className="flex-1">Still there? Need a hand completing this? <span className="text-accent font-semibold">We can help.</span></span>
          <button onClick={resetActivity} className="text-white/50 hover:text-white transition-colors shrink-0"><X size={13} /></button>
        </div>
      )}

      {/* ── Input bar ── */}
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
                    if (reviewing && extraContext.trim()) generateResults(extraContext);
                    else if (!reviewing && input.trim()) advance(input.trim());
                  }
                }}
                placeholder={reviewing ? 'Add any extra context… (optional)' : (currentStep.type === 'text' ? (currentStep.placeholder || 'Type your answer…') : 'Or type your own answer…')}
                className="flex-1 bg-surface border-0 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-accent/20 placeholder-muted"
              />
              <button
                onClick={() => {
                  if (reviewing) { if (extraContext.trim()) generateResults(extraContext); else generateResults(); }
                  else if (input.trim()) advance(input.trim());
                }}
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white hover:opacity-90 transition-opacity shrink-0">
                <Send size={14} strokeWidth={2} />
              </button>
            </div>
            {!reviewing && (
              <p className="text-[10px] text-muted mt-1.5 text-center">
                Question {STEPS.findIndex(s => s.id === currentStep.id) + 1} of {STEPS.length} · Choose above or type freely
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
