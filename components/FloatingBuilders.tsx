'use client';

import { useState } from 'react';
import { FileText, BarChart2, X, Maximize2, Minimize2, Phone } from 'lucide-react';
import TechRequirementBuilder from './TechRequirementBuilder';
import TechStrategyBuilder from './TechStrategyBuilder';
import ZainVoiceCall from './ZainVoiceCall';

// ── Button config — fresh modern palette ──────────────────────────────────
const BTNS = [
  { id: 'req',   label: 'Tech Requirement Builder', bg: '#2563EB', ring: 'rgba(37,99,235,0.4)',  delay: '0s'   },
  { id: 'strat', label: 'Tech Strategy Builder',    bg: '#7C3AED', ring: 'rgba(124,58,237,0.4)', delay: '0.55s' },
  { id: 'call',  label: 'Talk to Zain',             bg: '#059669', ring: 'rgba(5,150,105,0.4)',  delay: '1.1s'  },
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
  const [showCall, setShowCall] = useState(false);
  const [reqFs,    setReqFs]    = useState(false);
  const [stratFs,  setStratFs]  = useState(false);

  return (
    <>
      <style>{`
        @keyframes fpulse{0%{transform:scale(1);opacity:.5}80%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}
        .fpulse{animation:fpulse 2.2s cubic-bezier(.4,0,.6,1) infinite}
      `}</style>

      {/* ── Floating buttons ── */}
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
              aria-label={btn.label}
              onClick={() => {
                if (btn.id === 'req')   { setShowReq(true);   setReqFs(false); }
                if (btn.id === 'strat') { setShowStrat(true); setStratFs(false); }
                if (btn.id === 'call')  setShowCall(true);
              }}
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:scale-[1.12] active:scale-95 transition-transform duration-150"
              style={{ background: btn.bg, boxShadow: `0 4px 16px ${btn.ring}` }}
            >
              {/* Staggered blink ring */}
              <span className="fpulse absolute inset-0 rounded-full" style={{ background: btn.bg, animationDelay: btn.delay }} />

              {btn.id === 'req'   && <FileText      size={16} strokeWidth={2}   className="text-white relative z-10" />}
              {btn.id === 'strat' && <BarChart2     size={16} strokeWidth={2}   className="text-white relative z-10" />}
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

      {showCall && <ZainVoiceCall onClose={() => setShowCall(false)} />}
    </>
  );
}
