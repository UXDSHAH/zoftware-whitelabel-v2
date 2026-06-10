'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, BarChart2, X, Maximize2, Minimize2, Phone, PhoneOff, Mic, Send, Sparkles, MessageSquare } from 'lucide-react';
import TechRequirementBuilder from './TechRequirementBuilder';
import TechStrategyBuilder from './TechStrategyBuilder';

// ── Inline Zain chat ──────────────────────────────────────────────────────
const ZAIN_QUICK: { kw: string[]; reply: string }[] = [
  { kw: ['hello','hi','hey'], reply: "Hi! I'm Zain, your AI software advisor. How can I help you today?" },
  { kw: ['crm','sales'], reply: "For CRM I recommend **Freshsales** ($72/user/mo) or **Zoho CRM** ($21.85/user/mo) — both GCC-optimised with 7-day activation." },
  { kw: ['bundle'], reply: "We have 3 bundles: **Starter** ($299/mo, −40%), **Growth** ($599/mo, −33%), and **Expansion** ($999/mo, −33%)." },
  { kw: ['price','cost'], reply: "All prices include GCC-exclusive discounts up to 40% off. Toggle USD/AED and monthly/annual on any product page." },
  { kw: ['erp'], reply: "Top ERP picks for GCC: **Odoo** (best value), **Microsoft Dynamics 365**, and **SAP Business One**." },
  { kw: ['support','help'], reply: "Reach us at support@zoftware.com or WhatsApp +971 55 000 0000. Available Sun–Thu, 9am–6pm GST." },
];

function ZainChat({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState([{ role: 'bot', text: "Hi! I'm **Zain**, your AI software advisor. Ask me anything about software, pricing, or bundles." }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = () => {
    const q = input.trim(); if (!q) return;
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setInput(''); setTyping(true);
    const low = q.toLowerCase();
    const match = ZAIN_QUICK.find(r => r.kw.some(k => low.includes(k)));
    const reply = match?.reply || "Great question! Try our Tech Requirement Builder for personalised recommendations, or I can connect you with our team.";
    setTimeout(() => { setTyping(false); setMsgs(m => [...m, { role: 'bot', text: reply }]); }, 800);
  };

  const rich = (t: string) => t.split(/\*\*(.*?)\*\*/g).map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '380px' }}>
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'bot' && (
              <div className="w-7 h-7 rounded-full shrink-0 mt-0.5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)' }}>
                <Sparkles size={13} strokeWidth={2} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.55] ${m.role === 'bot' ? 'bg-[#f4f4f5] text-black rounded-tl-sm' : 'bg-[#2563EB] text-white rounded-tr-sm'}`}>
              {rich(m.text)}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)' }}>
              <Sparkles size={13} strokeWidth={2} className="text-white" />
            </div>
            <div className="bg-[#f4f4f5] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${i*0.12}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-zinc-100 p-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask Zain anything…"
          className="flex-1 bg-[#f4f4f5] rounded-full px-4 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-orange-200 placeholder-zinc-400" />
        <button onClick={send} className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)' }}>
          <Send size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ── Voice call modal ──────────────────────────────────────────────────────
const SCRIPTS = [
  "Hello! I'm Zain, your AI software advisor. How can I help you today?",
  "I can find the right software for your business. What are you looking for?",
  "Based on your needs, I'd suggest exploring our GCC-optimised bundles. Shall I walk you through them?",
  "Is there anything else I can help you with today?",
];

function VoiceCallModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'connecting'|'listening'|'speaking'|'ended'>('connecting');
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('speaking'), 1400);
    const t2 = setTimeout(() => setPhase('listening'), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase === 'ended') return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const tapMic = () => {
    setMuted(true);
    setTimeout(() => { setMuted(false); setPhase('speaking'); setTimeout(() => { setIdx(i => Math.min(i+1, SCRIPTS.length-1)); setPhase('listening'); }, 2800); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-[320px] rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg,#09090b,#18181b,#1c1917)' }}>
        <div className="px-6 pt-9 pb-3 text-center">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.14em] mb-1">
            {phase === 'connecting' ? 'Connecting…' : phase === 'ended' ? 'Call ended' : fmt(sec)}
          </p>
          <p className="text-[17px] font-semibold text-white">Zain AI</p>
          <p className="text-[12px] text-white/40 mt-0.5">Software Advisor</p>
        </div>

        <div className="flex flex-col items-center py-7">
          {/* Avatar */}
          <div className="relative mb-5">
            {phase === 'speaking' && <>
              <div className="absolute inset-0 rounded-full animate-ping opacity-15 scale-[1.5]" style={{ background: 'radial-gradient(circle,#f97316,#ec4899)' }} />
              <div className="absolute inset-0 rounded-full animate-ping opacity-10 scale-[2.1]" style={{ background: 'radial-gradient(circle,#f97316,#ec4899)', animationDelay: '0.35s' }} />
            </>}
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#ec4899)' }}>
              <Sparkles size={34} strokeWidth={1.5} className="text-white" />
            </div>
          </div>

          <p className={`text-[12px] font-medium mb-5 ${phase === 'speaking' ? 'text-orange-400' : phase === 'listening' ? 'text-pink-400' : 'text-white/30'}`}>
            {phase === 'connecting' ? 'Connecting…' : phase === 'speaking' ? '● Speaking' : phase === 'listening' ? '◎ Listening' : 'Ended'}
          </p>

          {/* Waveform */}
          <div className="flex items-center gap-0.5 h-10 mb-5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-0.5 rounded-full transition-all duration-150"
                style={{
                  height: (phase === 'speaking' || (phase === 'listening' && !muted)) ? `${8 + Math.abs(Math.sin(i * 0.7)) * 22}px` : '3px',
                  background: phase === 'speaking' ? 'linear-gradient(180deg,#f97316,#ec4899)' : phase === 'listening' ? 'linear-gradient(180deg,#ec4899,#8b5cf6)' : 'rgba(255,255,255,0.15)',
                  animation: (phase === 'speaking' || (phase === 'listening' && !muted)) ? `wb ${0.3 + (i%6)*0.08}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${i*0.04}s`,
                }} />
            ))}
          </div>
          <style>{`@keyframes wb{from{transform:scaleY(.25)}to{transform:scaleY(1)}}`}</style>

          {phase === 'speaking' && (
            <div className="mx-6 rounded-2xl px-4 py-3 mb-4 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className="text-[12px] text-white/70 leading-relaxed">{SCRIPTS[idx]}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 px-6 pb-9">
          <button onClick={() => { setMuted(m => !m); if (!muted) tapMic(); }}
            className="w-13 h-13 w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{ background: muted ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.09)' }}>
            <Mic size={18} className={muted ? 'text-red-400' : 'text-white'} strokeWidth={2} />
          </button>
          <button onClick={() => { setPhase('ended'); setTimeout(onClose, 700); }}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
            <PhoneOff size={22} className="text-white" strokeWidth={2} />
          </button>
          <button onClick={tapMic}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.09)' }}>
            <Send size={16} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Button config — fresh modern palette ──────────────────────────────────
const BTNS = [
  { id: 'req',   label: 'Tech Requirement Builder', bg: '#2563EB', ring: 'rgba(37,99,235,0.4)',  delay: '0s'   },
  { id: 'strat', label: 'Tech Strategy Builder',    bg: '#7C3AED', ring: 'rgba(124,58,237,0.4)', delay: '0.55s' },
  { id: 'zain',  label: 'Zain AI Chat',             bg: '#f97316', ring: 'rgba(249,115,22,0.4)', delay: '1.1s'  },
  { id: 'call',  label: 'Talk to Zain',             bg: '#059669', ring: 'rgba(5,150,105,0.4)',  delay: '1.65s' },
];

// ── Shared modal shell ────────────────────────────────────────────────────
function Modal({ show, onClose, fs, setFs, title, accentBg, children }: {
  show: boolean; onClose: ()=>void; fs: boolean; setFs: (v:boolean)=>void;
  title: string; accentBg: string; children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <div className={`fixed z-50 ${fs ? 'inset-0' : 'inset-0 flex items-center justify-center p-4'}`}>
      {!fs && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />}
      <div className={`relative bg-white flex flex-col overflow-hidden shadow-2xl ${fs ? 'w-full h-full' : 'w-full max-w-2xl max-h-[90vh] rounded-xl'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full" style={{ background: accentBg }} />
            <span className="text-[13px] font-semibold text-zinc-900">{title}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setFs(!fs)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">
              {fs ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function FloatingBuilders() {
  const [showReq,  setShowReq]  = useState(false);
  const [showStrat,setShowStrat]= useState(false);
  const [showZain, setShowZain] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [reqFs,    setReqFs]    = useState(false);
  const [stratFs,  setStratFs]  = useState(false);
  const [zainFs,   setZainFs]   = useState(false);

  // Temporarily hidden
  return null;

  return (
    <>
      <style>{`
        @keyframes fpulse{0%{transform:scale(1);opacity:.5}80%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}
        .fpulse{animation:fpulse 2.2s cubic-bezier(.4,0,.6,1) infinite}
      `}</style>

      {/* ── 4 floating buttons ── */}
      <div className="fixed left-4 bottom-4 z-40 flex flex-col gap-3.5">
        {BTNS.map(btn => (
          <div key={btn.id} className="group relative flex items-center justify-start">
            {/* Tooltip */}
            <span className="absolute left-full ml-3.5 bg-zinc-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap
              opacity-0 group-hover:opacity-100 pointer-events-none -translate-x-2 group-hover:translate-x-0 transition-all duration-150 shadow-xl">
              {btn.label}
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[6px] border-[5px] border-transparent border-r-zinc-900" />
            </span>

            <button
              onClick={() => {
                if (btn.id === 'req')   { setShowReq(true);   setReqFs(false); }
                if (btn.id === 'strat') { setShowStrat(true); setStratFs(false); }
                if (btn.id === 'zain')  { setShowZain(true);  setZainFs(false); }
                if (btn.id === 'call')  setShowCall(true);
              }}
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:scale-[1.12] active:scale-95 transition-transform duration-150"
              style={{ background: btn.bg, boxShadow: `0 4px 16px ${btn.ring}` }}
            >
              {/* Staggered blink ring */}
              <span className="fpulse absolute inset-0 rounded-full" style={{ background: btn.bg, animationDelay: btn.delay }} />

              {btn.id === 'req'   && <FileText      size={16} strokeWidth={2}   className="text-white relative z-10" />}
              {btn.id === 'strat' && <BarChart2     size={16} strokeWidth={2}   className="text-white relative z-10" />}
              {btn.id === 'zain'  && <MessageSquare size={16} strokeWidth={2}   className="text-white relative z-10" />}
              {btn.id === 'call'  && <Phone         size={16} strokeWidth={2}   className="text-white relative z-10" />}
            </button>
          </div>
        ))}
      </div>

      {/* ── Modals ── */}
      <Modal show={showReq} onClose={() => setShowReq(false)} fs={reqFs} setFs={setReqFs}
        title="Tech Requirement Builder" accentBg="#2563EB">
        <TechRequirementBuilder onClose={() => setShowReq(false)} />
      </Modal>

      <Modal show={showStrat} onClose={() => setShowStrat(false)} fs={stratFs} setFs={setStratFs}
        title="Tech Strategy Builder" accentBg="#7C3AED">
        <TechStrategyBuilder onClose={() => setShowStrat(false)} />
      </Modal>

      <Modal show={showZain} onClose={() => setShowZain(false)} fs={zainFs} setFs={setZainFs}
        title="Zain AI Chat" accentBg="linear-gradient(135deg,#f97316,#ec4899)">
        <ZainChat onClose={() => setShowZain(false)} />
      </Modal>

      {showCall && <VoiceCallModal onClose={() => setShowCall(false)} />}
    </>
  );
}
