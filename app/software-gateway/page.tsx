'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, FileText, BarChart2, TrendingDown, ArrowRight, Zap,
  MessageSquare, Phone, X, Send, Sparkles, ChevronRight,
  ExternalLink, PhoneOff
} from 'lucide-react';
import { gatewayProducts } from '@/data/gateway-products';
import ThemeToggle from '@/components/ThemeToggle';

// ── Tool cards — Smart Search → Tech Strategy → Tech Requirement → Cost Optimizer
const tools = [
  {
    icon: <Search size={20} strokeWidth={1.5} />,
    label: 'Smart Search',
    desc: 'Find the right software from 50+ verified products in seconds.',
    href: '/software',
    color: 'var(--color-accent)',
    badge: 'Instant results',
    external: false,
  },
  {
    icon: <BarChart2 size={20} strokeWidth={1.5} />,
    label: 'Tech Strategy Builder',
    desc: 'Get a full tech strategy and implementation roadmap in under 1 minute.',
    href: '/software/report/strategy',
    color: '#7C3AED',
    badge: 'AI-generated',
    external: false,
  },
  {
    icon: <FileText size={20} strokeWidth={1.5} />,
    label: 'Tech Requirement Builder',
    desc: 'Generate a detailed technical requirements document for your procurement.',
    href: '/software/report/requirements',
    color: '#0284C7',
    badge: 'RFP-ready',
    external: false,
  },
  {
    icon: <TrendingDown size={20} strokeWidth={1.5} />,
    label: 'Cost Optimizer',
    desc: 'Analyse your current software spend and uncover savings opportunities instantly.',
    href: 'https://enterprise-level-redesign.vercel.app?autoauth=zv2',
    color: '#16A34A',
    badge: 'Save up to 40%',
    external: true,
  },
];

// ── Logos ─────────────────────────────────────────────────────────────────────
const logos = [
  { name: 'Zoho',         src: '/logos/zoho.avif'        },
  { name: 'Dynamics 365', src: '/logos/dynamics365.avif' },
  { name: 'Sprinklr',     src: '/logos/sprinklr.avif'    },
  { name: 'Snowflake',    src: '/logos/snowflake.avif'   },
  { name: 'Genesys',      src: '/logos/genesys.avif'     },
  { name: 'Tally',        src: '/logos/tally.avif'       },
  { name: 'Workleap',     src: '/logos/workleap.avif'    },
  { name: 'Zimperium',    src: '/logos/zimperium.avif'   },
];

// ── Chatbot types ─────────────────────────────────────────────────────────────
type Message = {
  role: 'assistant' | 'user';
  text: string;
  products?: typeof gatewayProducts;
  toolLink?: { label: string; href: string; external?: boolean };
};

const GREETING: Message = {
  role: 'assistant',
  text: "Hi! I'm Zain, your Software Gateway assistant. I can help you find the right software, build a requirements doc, or create a tech strategy.\n\nWhat are you looking for?",
};

function searchProducts(query: string) {
  const q = query.toLowerCase();
  return gatewayProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.vendor.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4);
}

// ── Browser-based caller ──────────────────────────────────────────────────────
function BrowserCaller({ onClose }: { onClose: () => void }) {
  const [callState, setCallState] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [duration,  setDuration]  = useState(0);
  const [bars,      setBars]      = useState<number[]>(Array(18).fill(4));
  const streamRef  = useRef<MediaStream | null>(null);
  const animRef    = useRef<number | null>(null);

  const stopAll = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const simulateWave = () => {
      setBars(Array(18).fill(0).map(() => Math.random() * 28 + 4));
      animRef.current = requestAnimationFrame(simulateWave);
    };

    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const draw = () => {
          analyser.getByteFrequencyData(data);
          setBars(Array.from(data.slice(0, 18)).map(v => Math.max(4, (v / 255) * 36)));
          animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        setTimeout(() => setCallState('active'), 1800);
      })
      .catch(() => {
        // no mic — use simulated waveform
        setTimeout(() => setCallState('active'), 1800);
        animRef.current = requestAnimationFrame(simulateWave);
      });

    return stopAll;
  }, [stopAll]);

  useEffect(() => {
    if (callState !== 'active') return;
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const hangUp = () => {
    stopAll();
    setCallState('ended');
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f1a] rounded-2xl p-8 w-full max-w-[300px] text-center shadow-2xl border border-white/8">

        {/* Zain avatar with animated ring */}
        <div className="relative inline-flex items-center justify-center mb-5">
          {callState === 'active' && (
            <>
              <div className="absolute w-20 h-20 rounded-full border-2 border-green-400/30 animate-ping" />
              <div className="absolute w-24 h-24 rounded-full border border-green-400/15 animate-ping" style={{ animationDelay: '0.4s' }} />
            </>
          )}
          {callState === 'connecting' && (
            <div className="absolute w-20 h-20 rounded-full border-2 border-yellow-400/30 animate-ping" />
          )}
          <img src="/zain-avatar.svg" alt="Zain" className="w-16 h-16 rounded-full relative z-10" />
        </div>

        <p className="text-white font-semibold text-[16px] mb-0.5">Zain</p>
        <p className="text-white/40 text-[11px] mb-3">Software Gateway · Voice Agent</p>

        <p className="text-[12px] font-medium mb-6" style={{
          color: callState === 'connecting' ? '#FCD34D'
               : callState === 'active'     ? '#34D399'
               : '#F87171',
        }}>
          {callState === 'connecting' ? 'Connecting…'
         : callState === 'active'     ? `Connected · ${fmt(duration)}`
         : 'Call ended'}
        </p>

        {/* Waveform */}
        <div className="flex items-end justify-center gap-[3px] mb-8 h-10">
          {bars.map((h, i) => (
            <div key={i}
              className="rounded-full transition-all duration-75"
              style={{
                width: '3px',
                height: callState === 'active' ? `${h}px` : '4px',
                backgroundColor: callState === 'active' ? '#34D399'
                               : callState === 'connecting' ? '#FCD34D'
                               : '#F87171',
                opacity: callState === 'active' ? 0.5 + (h / 36) * 0.5 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Hang up button */}
        {callState !== 'ended' ? (
          <button onClick={hangUp}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center mx-auto transition-colors shadow-lg shadow-red-500/30">
            <PhoneOff size={20} className="text-white" />
          </button>
        ) : (
          <p className="text-white/30 text-[12px]">Closing…</p>
        )}
      </div>
    </div>
  );
}

// ── Chatbot panel ─────────────────────────────────────────────────────────────
function ZainChatbot({ defaultOpen }: { defaultOpen: boolean }) {
  const [open,       setOpen]   = useState(defaultOpen);
  const [calling,    setCalling] = useState(false);
  const [input,      setInput]  = useState('');
  const [messages,   setMsgs]   = useState<Message[]>([GREETING]);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const q = text.toLowerCase();
    let reply: Message;

    if (q.includes('smart search') || q.includes('search software') || q.includes('find software')) {
      reply = { role: 'assistant', text: 'Smart Search lets you browse all 50+ verified products, filter by category, and sort by price or rating.',
        toolLink: { label: 'Open Smart Search →', href: '/software' } };
    } else if (q.includes('strateg') || q.includes('roadmap') || q.includes('tech plan')) {
      reply = { role: 'assistant', text: 'The Tech Strategy Builder generates a full implementation roadmap tailored to your business — in under a minute.',
        toolLink: { label: 'Build My Tech Strategy →', href: '/software/report/strategy' } };
    } else if (q.includes('requirement') || q.includes('rfp') || q.includes('procurement') || q.includes('document')) {
      reply = { role: 'assistant', text: 'The Tech Requirement Builder creates a professional RFP-ready document you can share directly with software vendors.',
        toolLink: { label: 'Build Requirements Doc →', href: '/software/report/requirements' } };
    } else if (q.includes('cost') || q.includes('saving') || q.includes('spend') || q.includes('budget') || q.includes('optim')) {
      reply = { role: 'assistant', text: 'The Cost Optimizer benchmarks your software spend against GCC pricing to find savings opportunities instantly.',
        toolLink: { label: 'Analyse My Spend →', href: 'https://enterprise-level-redesign.vercel.app?autoauth=zv2', external: true } };
    } else {
      const results = searchProducts(text);
      reply = results.length > 0
        ? { role: 'assistant', text: `Found ${results.length} product${results.length > 1 ? 's' : ''} matching "${text}":`, products: results }
        : { role: 'assistant', text: `I didn't find an exact match for "${text}". Try Smart Search to browse all 50+ products.`,
            toolLink: { label: 'Try Smart Search →', href: '/software' } };
    }

    setMsgs(prev => [...prev, { role: 'user', text }, reply]);
    setInput('');
  };

  const quickAction = (tool: typeof tools[0]) => {
    const reply: Message = { role: 'assistant', text: tool.desc,
      toolLink: { label: `Launch ${tool.label} →`, href: tool.href, external: tool.external } };
    setMsgs(prev => [...prev, { role: 'user', text: tool.label }, reply]);
  };

  return (
    <>
      {/* FAB buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {/* Call */}
        <button onClick={() => setCalling(true)}
          title="Talk to Zain"
          className="w-11 h-11 rounded-full bg-white border border-black/12 shadow-lg flex items-center justify-center text-[#555] hover:text-black hover:shadow-xl transition-all">
          <Phone size={16} />
        </button>
        {/* Chat toggle */}
        <button onClick={() => setOpen(o => !o)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
          {open ? <X size={18} /> : <MessageSquare size={18} />}
        </button>
      </div>

      {/* Chat panel */}
      <div className={`fixed bottom-24 right-6 w-[360px] z-40 flex flex-col rounded-xl overflow-hidden bg-white border border-black/10 shadow-2xl transition-all duration-300 origin-bottom-right ${
        open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
      }`} style={{ maxHeight: '540px' }}>

        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-black/8"
          style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
          <img src="/zain-avatar.svg" alt="Zain" className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white leading-none">Zain</p>
            <p className="text-[10px] text-white/50 mt-0.5">Software Gateway · AI Assistant</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 mr-1" title="Online" />
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[88%]">
                {msg.role === 'assistant' && (
                  <img src="/zain-avatar.svg" alt="Zain" className="w-5 h-5 rounded-full mb-1.5" />
                )}
                <div className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-[#f5f5f7] text-[#333] rounded-bl-sm'
                }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' } : {}}>
                  {msg.text}
                </div>

                {/* Product results */}
                {msg.products && (
                  <div className="mt-2 space-y-1.5">
                    {msg.products.map(p => (
                      <Link key={p.id} href={`/software/product/${p.slug}`}
                        className="flex items-center gap-2.5 bg-white border border-black/8 rounded-lg px-3 py-2 hover:border-accent/30 hover:bg-accent/4 transition-all group">
                        <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 shrink-0">
                          {p.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-black leading-none group-hover:text-accent transition-colors">{p.name}</p>
                          <p className="text-[10px] text-muted mt-0.5 truncate">{p.category}</p>
                        </div>
                        <ChevronRight size={11} className="text-muted group-hover:text-accent shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Tool link */}
                {msg.toolLink && (
                  msg.toolLink.external ? (
                    <a href={msg.toolLink.href} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                      {msg.toolLink.label} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <Link href={msg.toolLink.href}
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                      {msg.toolLink.label} <ArrowRight size={11} />
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}

          {/* Quick actions after greeting */}
          {messages.length === 1 && (
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {tools.map(t => (
                <button key={t.label} onClick={() => quickAction(t)}
                  className="text-left px-2.5 py-2 border border-black/8 rounded-lg text-[11px] font-medium text-[#333] hover:border-black/20 hover:bg-[#f5f5f7] transition-all leading-snug">
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-black/8 px-3 py-2.5 flex items-center gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about any software…"
            className="flex-1 text-[12px] bg-[#f5f5f7] border border-black/8 rounded-lg px-3 py-2 outline-none focus:border-accent/30 transition-all"
          />
          <button onClick={() => send(input)} disabled={!input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white disabled:opacity-40 shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            <Send size={13} />
          </button>
        </div>
      </div>

      {/* Browser caller overlay */}
      {calling && <BrowserCaller onClose={() => setCalling(false)} />}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SoftwareGatewayPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/dubai-chamber" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[2px]">
                {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]" />)}
              </div>
            </div>
            <span className="text-[14px] font-bold text-black tracking-tight">LOGO</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/software"
              className="flex items-center gap-1.5 bg-black text-white text-[12px] font-semibold px-4 py-2 rounded-sm hover:bg-[#333] transition-colors min-h-[36px]">
              Browse All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main section — header + logo + cards all on first fold ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-[0.07]"
          style={{ background: 'radial-gradient(ellipse, #007AFF 0%, transparent 70%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-6">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-[0.1em] uppercase mb-4 shadow-sm shadow-accent/20">
                <Zap size={11} strokeWidth={2.5} /> Software Gateway
              </div>
              <h2 className="text-[24px] sm:text-[32px] font-medium text-black tracking-tight leading-[1.1] mb-2.5">
                Procure the right software.<br />
                <span className="text-accent">In minutes, not months.</span>
              </h2>
              <p className="text-[13px] font-semibold text-accent mb-2 flex items-center gap-1.5">
                <Sparkles size={13} strokeWidth={2} />
                AI-powered digital collaboration hub for business growth
              </p>
              <p className="text-[13px] text-[#555] max-w-[460px] leading-[1.7]">
                Access 50+ verified products with GCC-exclusive pricing, bundle deals, and AI-powered recommendations built in.
              </p>
            </div>
            <Link href="/software"
              className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[13px] font-semibold rounded-sm hover:bg-[#222] transition-colors shrink-0 min-h-[44px] whitespace-nowrap self-start sm:self-auto">
              Browse All Software <ArrowRight size={13} strokeWidth={2} />
            </Link>
          </div>

          {/* Logo strip */}
          <div className="mb-5 overflow-hidden border border-black/6 rounded-sm bg-white py-3">
            <div className="relative">
              <div className="th-logo-fade-l absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />
              <div className="th-logo-fade-r absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />
              <div className="flex items-center w-max" style={{ animation: 'marquee 32s linear infinite' }}>
                {(Array(4).fill(logos).flat() as typeof logos).map((brand, i) => (
                  <div key={i} className="flex items-center shrink-0 px-7">
                    <img src={brand.src} alt={brand.name} className="h-5 w-auto max-w-[80px] object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 tool cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {tools.map((tool, i) => (
              tool.external ? (
                <a key={tool.label} href={tool.href} target="_blank" rel="noopener noreferrer"
                  className="relative border border-black/8 rounded-sm p-5 hover:border-black/20 hover:shadow-md transition-all group bg-white overflow-hidden cursor-pointer">
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${tool.color}20 0%, transparent 70%)` }} />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center relative"
                      style={{ backgroundColor: tool.color + '12' }}>
                      <span style={{ color: tool.color }}>{tool.icon}</span>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center text-[8px] font-bold"
                        style={{ color: tool.color, borderColor: tool.color + '40' }}>
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ color: tool.color, backgroundColor: tool.color + '10', border: `1px solid ${tool.color}25` }}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-black mb-1.5 leading-tight">{tool.label}</h3>
                  <p className="text-[12px] text-[#555] leading-[1.6] mb-4">{tool.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold group-hover:gap-2 transition-all"
                    style={{ color: tool.color }}>
                    Get started <ExternalLink size={11} />
                  </span>
                </a>
              ) : (
                <Link key={tool.label} href={tool.href}
                  className="relative border border-black/8 rounded-sm p-5 hover:border-black/20 hover:shadow-md transition-all group bg-white overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${tool.color === 'var(--color-accent)' ? '#007AFF' : tool.color}20 0%, transparent 70%)` }} />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center relative"
                      style={{ backgroundColor: tool.color === 'var(--color-accent)' ? 'rgba(0,122,255,0.08)' : tool.color + '12' }}>
                      <span style={{ color: tool.color }}>{tool.icon}</span>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center text-[8px] font-bold"
                        style={{
                          color: tool.color === 'var(--color-accent)' ? 'var(--color-accent)' : tool.color,
                          borderColor: tool.color === 'var(--color-accent)' ? 'rgba(0,122,255,0.35)' : tool.color + '40',
                        }}>
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        color: tool.color === 'var(--color-accent)' ? 'var(--color-accent)' : tool.color,
                        backgroundColor: tool.color === 'var(--color-accent)' ? 'rgba(0,122,255,0.08)' : tool.color + '10',
                        border: `1px solid ${tool.color === 'var(--color-accent)' ? 'rgba(0,122,255,0.2)' : tool.color + '25'}`,
                      }}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-black mb-1.5 leading-tight">{tool.label}</h3>
                  <p className="text-[12px] text-[#555] leading-[1.6] mb-4">{tool.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold group-hover:gap-2 transition-all"
                    style={{ color: tool.color === 'var(--color-accent)' ? 'var(--color-accent)' : tool.color }}>
                    Get started <ArrowRight size={11} />
                  </span>
                </Link>
              )
            ))}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { v: '50+', l: 'Verified products',  c: 'var(--color-accent)' },
              { v: '12',  l: 'Software categories', c: 'var(--color-accent)' },
              { v: 'Up to 40%', l: 'Bundle savings', c: 'var(--color-accent)' },
              { v: '7 days', l: 'Average activation', c: '#FF9500' },
            ].map(({ v, l, c }) => (
              <div key={l} className="border border-black/8 rounded-sm px-4 py-3 bg-white">
                <p className="text-[16px] font-semibold leading-none mb-1" style={{ color: c }}>{v}</p>
                <p className="text-[11px] text-muted">{l}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-muted">
            Powered by <span className="font-semibold text-black">Zoftware</span> · Trusted by 5,000+ businesses across MENA & GCC
          </p>
        </div>
      </section>

      {/* ── Zain chatbot + caller ── */}
      <ZainChatbot defaultOpen={true} />
    </div>
  );
}
