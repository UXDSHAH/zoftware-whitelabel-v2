'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronDown } from 'lucide-react';

// Zain Bot SVG — inline so the sparkle stars can be animated
function ZainBotIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes zain-star-1 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        @keyframes zain-star-2 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(0.65)} }
        @keyframes zain-star-3 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        .zs1{transform-origin:29.8px 4.2px;animation:zain-star-1 2.4s ease-in-out infinite}
        .zs2{transform-origin:35px 11px;animation:zain-star-2 2.4s ease-in-out infinite 0.6s}
        .zs3{transform-origin:39.2px 3.7px;animation:zain-star-3 2.4s ease-in-out infinite 1.2s}
      `}</style>
      <g filter="url(#filter0_d_7521_5579)">
        <rect x="6.2738" y="6.27344" width="25.6182" height="25.6182" rx="12.8091" fill="url(#paint0_linear_7521_5579)"/>
      </g>
      <path d="M16.8026 13.344L13.3502 16.6941C13.2603 16.7813 13.1063 16.719 13.1063 16.5945V13.8796C13.1063 13.4561 13.4657 13.1074 13.902 13.1074H16.6999C16.8283 13.1074 16.8924 13.2569 16.8026 13.344Z" fill="white"/>
      <path d="M25.2091 13.5931C25.2091 13.7177 25.1577 13.8422 25.0679 13.9294C25.0551 13.9418 25.0551 13.9418 25.0422 13.9543L21.962 16.9432L18.4197 20.3804L17.2903 21.4764L17.0465 21.7005L14.4796 24.2037L13.3373 25.3121C13.1962 25.1627 13.1063 24.9759 13.1063 24.7517V20.1687C13.1063 19.9819 13.1833 19.8075 13.3245 19.6706L19.87 13.3191C20.0112 13.1821 20.1909 13.1074 20.3834 13.1074H24.7085C24.9781 13.1074 25.2091 13.3316 25.2091 13.5931Z" fill="white"/>
      <path d="M25.5062 21.9833C25.5062 22.0455 25.4805 22.1078 25.442 22.1576C25.4291 22.1701 25.4163 22.1825 25.4035 22.195L22.4002 25.1216C22.1307 25.3831 21.7585 25.5326 21.3735 25.5326H13.9039C13.6858 25.5326 13.4804 25.4454 13.3392 25.3084L14.4687 24.2125L17.0483 21.6968L17.2794 21.4727C17.4205 21.6097 17.6259 21.6968 17.8441 21.6968H25.211C25.3778 21.6968 25.5062 21.8338 25.5062 21.9833Z" fill="white"/>
      <path className="zs1" d="M29.8021 0C29.8021 0 30.0329 2.154 30.9318 3.0529C31.8306 3.9518 33.9846 4.18257 33.9846 4.18257C33.9846 4.18257 31.8306 4.41334 30.9318 5.31224C30.0329 6.21114 29.8021 8.36514 29.8021 8.36514C29.8021 8.36514 29.5713 6.21114 28.6724 5.31224C27.7735 4.41334 25.6195 4.18257 25.6195 4.18257C25.6195 4.18257 27.7735 3.9518 28.6724 3.0529C29.5713 2.154 29.8021 0 29.8021 0Z" fill="#051D53"/>
      <path className="zs2" d="M35.0257 7.8418C35.0257 7.8418 35.1988 9.45729 35.873 10.1315C36.5472 10.8056 38.1626 10.9787 38.1626 10.9787C38.1626 10.9787 36.5472 11.1518 35.873 11.826C35.1988 12.5002 35.0257 14.1157 35.0257 14.1157C35.0257 14.1157 34.8526 12.5002 34.1785 11.826C33.5043 11.1518 31.8888 10.9787 31.8888 10.9787C31.8888 10.9787 33.5043 10.8056 34.1785 10.1315C34.8526 9.45729 35.0257 7.8418 35.0257 7.8418Z" fill="#654CFF"/>
      <path className="zs3" d="M39.2123 1.56641C39.2123 1.56641 39.3276 2.6434 39.7771 3.09285C40.2265 3.5423 41.3035 3.65769 41.3035 3.65769C41.3035 3.65769 40.2265 3.77308 39.7771 4.22253C39.3276 4.67198 39.2123 5.74898 39.2123 5.74898C39.2123 5.74898 39.0969 4.67198 38.6474 4.22253C38.198 3.77308 37.121 3.65769 37.121 3.65769C37.121 3.65769 38.198 3.5423 38.6474 3.09285C39.0969 2.6434 39.2123 1.56641 39.2123 1.56641Z" fill="#A1AAFF"/>
      <defs>
        <filter id="filter0_d_7521_5579" x="-5.00679e-05" y="1.80332" width="38.166" height="38.1659" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1.80373"/>
          <feGaussianBlur stdDeviation="3.13693"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.488538 0 0 0 0 0 0 0 0 0 0.610673 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7521_5579"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7521_5579" result="shape"/>
        </filter>
        <linearGradient id="paint0_linear_7521_5579" x1="10.4564" y1="8.88754" x2="27.1867" y2="29.539" gradientUnits="userSpaceOnUse">
          <stop offset="0.0624894" stopColor="#DF8DFF"/>
          <stop offset="0.496582" stopColor="#3371FF"/>
          <stop offset="0.649043" stopColor="#004EFF"/>
          <stop offset="1" stopColor="#FF4CAE"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

type Message = { role: 'zain' | 'user'; text: string; ts?: string };

const ZAIN_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'start'],
    reply: "Hi there! I'm Zain, your AI software advisor powered by Zoftware. I can help you find the right software, build a tech strategy, or compare products. What are you looking for today?",
  },
  {
    keywords: ['crm', 'sales', 'customer relationship'],
    reply: "Great choice! For CRM, I recommend starting with **Freshsales** (GCC-optimised, 10% off at $72/user/mo) or **Freshworks Enterprise** (40% off at $47.40/user/mo). Both activate within 7 days. Want me to compare them side by side?",
  },
  {
    keywords: ['support', 'chat', 'helpdesk', 'customer service'],
    reply: "For customer support, **Freshchat** is our top pick — live chat + AI bots at $46.55/user/mo (5% off). For helpdesk ticketing, **Freshdesk** at $52.25/user/mo with 5-day activation. Want to see both on the same screen?",
  },
  {
    keywords: ['bundle', 'package', 'combo', 'starter', 'growth', 'expansion'],
    reply: "Our bundles save up to 40% vs buying individually:\n\n• **Starter Bundle** — $299/mo (team up to 10)\n• **Growth Bundle** — $599/mo (team up to 25)\n• **Expansion Bundle** — $999/mo (enterprise, 50+)\n\nAll include email, chat, calling, and more. Which bundle fits your team size?",
  },
  {
    keywords: ['price', 'cost', 'pricing', 'aed', 'usd', 'dirham'],
    reply: "All our products are priced in USD and AED (rate: 3.67). For example, Freshchat at $46.55/user/mo = AED 170.9/user/mo. Would you like pricing for a specific product or bundle?",
  },
  {
    keywords: ['strategy', 'plan', 'roadmap', 'recommend'],
    reply: "I can build a tech strategy for your business in under a minute! Click **Tech Strategy Builder** in the menu above. You'll answer 5 quick questions and get a personalised software roadmap with recommended products and a phased implementation plan.",
  },
  {
    keywords: ['requirement', 'rfp', 'document', 'spec'],
    reply: "Need a tech requirements document? Use our **Tech Requirement Builder** — answer a few questions about your business needs and get a structured requirements doc ready to share with vendors. Click the button above to start.",
  },
  {
    keywords: ['email', 'mail', 'zoho'],
    reply: "For business email, **Zoho Mail Premium** is $19.60/user (billed half-yearly, 2% off). 50GB mailbox, custom domain, zero ads. It's included in all our bundles too. Want to add it to a bundle?",
  },
  {
    keywords: ['it', 'itsm', 'service management', 'freshservice'],
    reply: "**Freshservice** is our top IT Service Management pick — $46.55/user/mo (5% off, was $49). Includes asset tracking, incident management, and change management. Activates in 7 days. Part of our Growth and Expansion bundles.",
  },
  {
    keywords: ['call', 'calling', 'voip', 'phone', 'freshcaller'],
    reply: "**Freshcaller** gives you a cloud call center with IVR, smart escalations, and real-time dashboards at $37.05/user/mo (5% off). Included in all bundles. Want to buy it standalone or as part of a bundle?",
  },
  {
    keywords: ['activate', 'activation', 'how long', 'when'],
    reply: "Most software activates within **7 days** of purchase. Freshdesk is faster at **5 days**. You'll receive a confirmation email immediately after checkout, and our team will guide you through onboarding.",
  },
  {
    keywords: ['compare', 'comparison', 'vs', 'difference'],
    reply: "I can help you compare! Head to /compare to put up to 5 products side by side. Or tell me which two products you're comparing and I'll give you a quick breakdown here.",
  },
];

function getZainReply(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  for (const { keywords, reply } of ZAIN_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) return reply;
  }
  return "I'd be happy to help! Could you tell me more about your business — for example, your industry, team size, or the specific problem you're trying to solve? That'll help me recommend the right software.";
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ZainChat() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'zain',
      text: "Hi! I'm **Zain**, your AI software advisor. I can help you find software, build a tech strategy, or explore bundles. What are you looking for?",
      ts: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimised) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, minimised]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { role: 'user', text, ts: now() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getZainReply(text);
      setMessages(m => [...m, { role: 'zain', text: reply, ts: now() }]);
      setTyping(false);
    }, 900);
  };

  const renderText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-all border border-black/6"
          aria-label="Open Zain AI Chat"
          style={{ boxShadow: '0 4px 20px rgba(100,0,255,0.18), 0 1px 6px rgba(0,0,0,0.1)' }}
        >
          <ZainBotIcon size={40} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[360px] flex flex-col rounded-2xl shadow-2xl border border-black/10 overflow-hidden"
          style={{ maxHeight: minimised ? '56px' : '520px', transition: 'max-height 0.2s ease' }}>

          {/* Header */}
          <div className="bg-accent px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <ZainBotIcon size={26} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white leading-tight">Zain AI</p>
                <p className="text-[10px] text-white/70">Software Advisor · Zoftware</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimised(m => !m)}
                className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <ChevronDown size={15} className={`transition-transform ${minimised ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => { setOpen(false); setMinimised(false); }}
                className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <X size={15} />
              </button>
            </div>
          </div>

          {!minimised && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-white p-4 space-y-3" style={{ maxHeight: '360px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === 'zain'
                        ? 'bg-surface text-black rounded-tl-sm'
                        : 'bg-accent text-white rounded-tr-sm'
                    }`}>
                      <p className="text-[13px] leading-[1.5] whitespace-pre-line">{renderText(msg.text)}</p>
                      {msg.ts && <p className={`text-[10px] mt-1 ${msg.role === 'zain' ? 'text-muted' : 'text-white/60'}`}>{msg.ts}</p>}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-surface rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick chips */}
              <div className="bg-white border-t border-black/5 px-3 py-2 flex gap-2 overflow-x-auto">
                {['Show bundles', 'Best CRM', 'Pricing in AED', 'Tech Strategy'].map(chip => (
                  <button key={chip} onClick={() => { setInput(chip); }}
                    className="shrink-0 text-[11px] font-medium text-accent border border-accent/30 px-2.5 py-1 rounded-full hover:bg-accent/8 transition-colors whitespace-nowrap">
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="bg-white border-t border-black/8 p-3 flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask Zain anything…"
                  className="flex-1 bg-surface border-0 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-accent/20 placeholder-muted"
                />
                <button onClick={send}
                  className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-hover transition-colors shrink-0">
                  <Send size={14} strokeWidth={2} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
