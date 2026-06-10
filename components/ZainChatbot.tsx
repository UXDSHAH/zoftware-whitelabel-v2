'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Phone, X, Send, ArrowRight, ExternalLink, ChevronRight, PhoneOff, Mic, Ticket, Minus } from 'lucide-react';
import { gatewayProducts } from '@/data/gateway-products';
import { createTicket } from '@/lib/zain-tickets';

type Message = {
  role: 'assistant' | 'user';
  text: string;
  products?: typeof gatewayProducts;
  toolLink?: { label: string; href: string; external?: boolean };
  ticketId?: string;
};

const GREETING: Message = {
  role: 'assistant',
  text: "Hi! I'm Zain, your Software Gateway assistant powered by AI. I can help you find the right software, build a strategy, or answer procurement questions.\n\nWhat are you looking for?",
};

const QUICK_TOOLS = [
  { label: 'Smart Search',             emoji: '🔍', href: '/software?tool=search' },
  { label: 'Tech Strategy Builder',    emoji: '📊', href: '/software?tool=strategy' },
  { label: 'Tech Requirement Builder', emoji: '📋', href: '/software?tool=requirements' },
  { label: 'Cost Optimizer',           emoji: '💰', href: 'https://enterprise-level-redesign.vercel.app?autoauth=zv2', external: true },
];

const SUGGESTED = ['Find CRM', 'ERP options', 'HR software', 'Best for SME'];

function searchProducts(query: string) {
  const q = query.toLowerCase();
  return gatewayProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.vendor.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4);
}

// ── Browser-based voice caller ────────────────────────────────────────────────
function BrowserCaller({ onClose }: { onClose: () => void }) {
  const [callState, setCallState] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [duration,  setDuration]  = useState(0);
  const [bars,      setBars]      = useState<number[]>(Array(20).fill(4));
  const [muted,     setMuted]     = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef   = useRef<number | null>(null);

  const stopAll = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const simulate = () => {
      setBars(Array(20).fill(0).map(() => Math.random() * 28 + 3));
      animRef.current = requestAnimationFrame(simulate);
    };
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const an  = ctx.createAnalyser();
        an.fftSize = 64;
        src.connect(an);
        const data = new Uint8Array(an.frequencyBinCount);
        const draw = () => {
          an.getByteFrequencyData(data);
          setBars(Array.from(data.slice(0, 20)).map(v => Math.max(3, (v / 255) * 34)));
          animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        setTimeout(() => setCallState('active'), 1800);
      })
      .catch(() => {
        setTimeout(() => setCallState('active'), 1800);
        animRef.current = requestAnimationFrame(simulate);
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
  const hangUp = () => { stopAll(); setCallState('ended'); setTimeout(onClose, 1200); };
  const ringColor = callState === 'active' ? '#34D399' : callState === 'connecting' ? '#FCD34D' : '#F87171';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#0c0c1a] rounded-2xl px-8 py-10 w-full max-w-[300px] text-center shadow-2xl border border-white/8">
        <div className="relative inline-flex items-center justify-center mb-5">
          {callState !== 'ended' && (
            <>
              <div className="absolute w-20 h-20 rounded-full border-2 animate-ping"
                style={{ borderColor: ringColor + '50' }} />
              <div className="absolute w-26 h-26 rounded-full border animate-ping"
                style={{ borderColor: ringColor + '25', animationDelay: '0.5s', width: '6.5rem', height: '6.5rem' }} />
            </>
          )}
          <img src="/zain-avatar.svg" alt="Zain" className="w-16 h-16 rounded-full relative z-10" />
        </div>
        <p className="text-white font-semibold text-[16px] mb-1">Zain</p>
        <p className="text-white/40 text-[12px] mb-6">
          {callState === 'connecting' ? 'Connecting…' : callState === 'active' ? fmt(duration) : 'Call ended'}
        </p>
        {callState === 'active' && (
          <div className="flex items-end justify-center gap-0.5 h-8 mb-6">
            {bars.map((h, i) => (
              <div key={i} className="w-1 rounded-full transition-all duration-75"
                style={{ height: `${muted ? 3 : h}px`, backgroundColor: '#34D399', opacity: 0.7 + (i % 3) * 0.1 }} />
            ))}
          </div>
        )}
        <div className="flex items-center justify-center gap-5">
          <button onClick={() => setMuted(m => !m)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
            style={{ backgroundColor: muted ? '#DC2626' : 'rgba(255,255,255,0.12)' }}>
            <Mic size={18} strokeWidth={2} />
          </button>
          <button onClick={hangUp}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105"
            style={{ backgroundColor: '#DC2626' }}>
            <PhoneOff size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f4f4f6] rounded-2xl rounded-bl-sm w-fit">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

// ── ZainChatbot FABs + drawer ─────────────────────────────────────────────────
export default function ZainChatbot({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open,    setOpen]    = useState(defaultOpen);
  const [calling, setCalling] = useState(false);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMsgs]   = useState<Message[]>([GREETING]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('zain-open', onOpen);
    return () => window.removeEventListener('zain-open', onOpen);
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', text };
    const history = [...messages, userMsg];
    setMsgs(history);
    setInput('');
    setLoading(true);

    // Quick local product search to augment context
    const localHits = searchProducts(text);

    try {
      const res = await fetch('/api/zain-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, text: m.text })) }),
      });

      const data = await res.json();

      let reply: Message = {
        role: 'assistant',
        text: data.text,
        toolLink: data.toolLink ?? undefined,
      };

      // Attach local product results if AI didn't provide a tool link and we found matches
      if (!data.toolLink && localHits.length > 0 && !data.escalate) {
        reply.products = localHits;
      }

      // Auto-create ticket if AI flags escalation
      if (data.escalate) {
        const ticket = createTicket(
          `Chat inquiry: ${text.slice(0, 80)}`,
          `User asked: "${text}"\n\nConversation started at ${new Date().toLocaleString()}`
        );
        reply.text = data.text;
        reply.ticketId = ticket.id;
      }

      setMsgs(prev => [...prev, reply]);
    } catch {
      setMsgs(prev => [...prev, {
        role: 'assistant',
        text: "Sorry, I'm having trouble connecting. Let me raise a support ticket for you.",
        ticketId: createTicket(`Chat inquiry: ${text.slice(0, 80)}`, `User asked: "${text}"`).id,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickAction = (tool: typeof QUICK_TOOLS[0]) => {
    const reply: Message = { role: 'assistant', text: `Sure! Here's the link to ${tool.label}.`,
      toolLink: { label: `Launch ${tool.label} →`, href: tool.href, external: tool.external } };
    setMsgs(prev => [...prev, { role: 'user', text: tool.label }, reply]);
  };

  return (
    <>
      {/* ── FABs — hidden when drawer is open so they don't overlap the input ── */}
      {!open && (
        <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50">
          <button onClick={() => setOpen(true)} title="Chat with Zain"
            className="transition-all hover:scale-105 active:scale-95"
            style={{ filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.28))' }}>
            <img src="/zain-avatar.svg" alt="Zain" className="w-14 h-14 block" />
          </button>
          <button onClick={() => setCalling(true)} title="Call Zain"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#16A34A', boxShadow: '0 4px 10px rgba(22,163,74,0.35)' }}>
            <Phone size={15} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ── Scrim ── */}
      {open && (
        <div className="fixed inset-0 z-[39] bg-black/8 backdrop-blur-[1px]" onClick={() => setOpen(false)} />
      )}

      {/* ── Right drawer ── */}
      <div className={`fixed top-0 right-0 h-screen z-40 flex flex-col bg-white border-l border-black/10 shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: 'min(420px, 95vw)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/8 shrink-0"
          style={{ background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 100%)' }}>
          <div className="relative shrink-0">
            <img src="/zain-avatar.svg" alt="Zain" className="w-10 h-10 rounded-full" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#1a1a3a]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-white leading-none">Zain</p>
            <p className="text-[11px] text-white/50 mt-0.5">Software Gateway · AI Assistant · Online</p>
          </div>
          <button onClick={() => setOpen(false)} title="Minimise chat"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0">
            <Minus size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[90%]">
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <img src="/zain-avatar.svg" alt="Zain" className="w-5 h-5 rounded-full" />
                    <span className="text-[10px] font-semibold text-muted">Zain</span>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                  msg.role === 'user' ? 'text-white rounded-br-sm' : 'bg-[#f4f4f6] text-[#1a1a1a] rounded-bl-sm'
                }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' } : {}}>
                  {msg.text}
                </div>

                {/* Ticket created badge */}
                {msg.ticketId && (
                  <div className="mt-2 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5">
                    <Ticket size={13} className="text-orange-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-orange-700">Support ticket created</p>
                      <p className="text-[10px] text-orange-500">{msg.ticketId} · Deepa Rawat will follow up</p>
                    </div>
                  </div>
                )}

                {msg.products && (
                  <div className="mt-2 space-y-1.5">
                    {msg.products.map(p => (
                      <Link key={p.id} href={`/software/product/${p.slug}`}
                        className="flex items-center gap-3 bg-white border border-black/8 rounded-xl px-3.5 py-2.5 hover:border-accent/30 hover:bg-accent/4 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 shrink-0">{p.logo}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-black leading-none group-hover:text-accent transition-colors">{p.name}</p>
                          <p className="text-[10px] text-muted mt-0.5 truncate">{p.category}</p>
                        </div>
                        <ChevronRight size={12} className="text-muted group-hover:text-accent shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}
                {msg.toolLink && (
                  msg.toolLink.external ? (
                    <a href={msg.toolLink.href} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                      {msg.toolLink.label} <ExternalLink size={11} />
                    </a>
                  ) : (
                    <Link href={msg.toolLink.href}
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
                      {msg.toolLink.label} <ArrowRight size={11} />
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[90%]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <img src="/zain-avatar.svg" alt="Zain" className="w-5 h-5 rounded-full" />
                  <span className="text-[10px] font-semibold text-muted">Zain</span>
                </div>
                <TypingDots />
              </div>
            </div>
          )}

          {/* Quick action grid after greeting */}
          {messages.length === 1 && !loading && (
            <div className="grid grid-cols-2 gap-2 mt-1">
              {QUICK_TOOLS.map(t => (
                <button key={t.label} onClick={() => quickAction(t)}
                  className="text-left px-3 py-2.5 border border-black/8 rounded-xl text-[12px] font-medium text-[#333] hover:border-black/20 hover:bg-[#f4f4f6] transition-all leading-snug">
                  <span className="block text-muted text-[10px] mb-0.5">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested chips */}
        {messages.length <= 3 && !loading && (
          <div className="px-5 py-2 border-t border-black/6 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
            {SUGGESTED.map(q => (
              <button key={q} onClick={() => send(q)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-black/10 text-[#555] hover:border-accent/30 hover:text-accent whitespace-nowrap transition-all shrink-0">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-black/8 px-4 py-3.5 flex items-center gap-2.5 shrink-0 bg-white">
          <img src="/zain-avatar.svg" alt="Zain" className="w-7 h-7 rounded-full shrink-0" />
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask Zain anything about software…"
            disabled={loading}
            className="flex-1 text-[13px] bg-[#f4f4f6] border border-black/8 rounded-xl px-3.5 py-2.5 outline-none focus:border-accent/30 focus:bg-white transition-all disabled:opacity-60" />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 shrink-0 transition-all"
            style={{ background: input.trim() && !loading ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' : '#e5e5e5' }}>
            <Send size={14} />
          </button>
        </div>
      </div>

      {calling && <BrowserCaller onClose={() => setCalling(false)} />}
    </>
  );
}
