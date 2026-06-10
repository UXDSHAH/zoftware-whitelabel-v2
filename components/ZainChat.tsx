'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
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

const WELCOME_TEXT =
  "Hi! I'm **Zain**, your AI software advisor. I can help you find software, compare pricing, or explore bundles. What are you looking for?";

const quickChips = ['Show bundles', 'Best CRM', 'Pricing in AED', 'Tech Strategy'];

function messageText(message: UIMessage) {
  return message.parts
    .map(part => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim();
}

function hasText(message: UIMessage) {
  return messageText(message).length > 0;
}

function latestAssistantHasText(messages: UIMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === 'assistant') {
      return hasText(messages[i]);
    }
  }

  return false;
}

function friendlyErrorMessage(error?: Error) {
  if (!error) return '';

  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // AI SDK errors are sometimes plain text and sometimes serialized JSON.
  }

  return error.message || 'Please try again.';
}

function safeLinkProps(href: string) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return { href, isExternal: false };
  }

  try {
    const url = new URL(href);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return { href: url.href, isExternal: true };
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export default function ZainChat() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);
  const { messages, sendMessage, status, error } = useChat({
    transport,
    experimental_throttle: 80,
  });
  const isBusy = status === 'submitted' || status === 'streaming';
  const hasConversation = messages.some(message => message.role === 'user' || message.role === 'assistant');
  const showQuickChips = !hasConversation && !isBusy;
  const showTyping = status === 'submitted' || (status === 'streaming' && !latestAssistantHasText(messages));
  const errorMessage = friendlyErrorMessage(error);
  const visibleMessages = [
    { id: 'welcome', role: 'assistant' as const, text: WELCOME_TEXT },
    ...messages
      .map(message => ({
        id: message.id,
        role: message.role,
        text: messageText(message),
      }))
      .filter(message => message.role !== 'system' && message.text.length > 0),
  ];

  useEffect(() => {
    if (open && !minimised) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status, open, minimised]);

  const sendText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    void sendMessage({ text: trimmed });
    setInput('');
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    sendText(text);
  };

  const renderText = (text: string) =>
    text
      .split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g)
      .filter(Boolean)
      .map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const linkProps = safeLinkProps(link[2]);
          if (!linkProps) return <span key={i}>{link[1]}</span>;

          return (
            <a
              key={i}
              href={linkProps.href}
              target={linkProps.isExternal ? '_blank' : undefined}
              rel={linkProps.isExternal ? 'noopener noreferrer' : undefined}
              className="font-semibold underline underline-offset-2"
            >
              {link[1]}
            </a>
          );
        }

        const bold = part.match(/^\*\*(.*?)\*\*$/);
        return bold ? <strong key={i}>{bold[1]}</strong> : <span key={i}>{part}</span>;
      });

  return (
    <>
      <style>{`
        @keyframes zain-chat-pulse {
          0% { transform: scale(1); opacity: .36; }
          80% { transform: scale(2.05); opacity: 0; }
          100% { transform: scale(2.05); opacity: 0; }
        }

        .zain-chat-pulse {
          animation: zain-chat-pulse 2.2s cubic-bezier(.4, 0, .6, 1) infinite;
        }
      `}</style>

      {/* Floating button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 group w-14 h-14">
          <span className="zain-chat-pulse absolute inset-0 rounded-full bg-[#007AFF]" />
          <span className="zain-chat-pulse absolute inset-0 rounded-full bg-[#FF4CAE]" style={{ animationDelay: '0.65s' }} />
          <button
            onClick={() => setOpen(true)}
            className="relative z-10 w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-[1.12] active:scale-95 transition-transform duration-150 border border-white/80 overflow-hidden"
            aria-label="Open Zain AI Chat"
            style={{
              boxShadow: '0 8px 28px rgba(0,122,255,0.32), 0 6px 22px rgba(255,76,174,0.22), 0 1px 7px rgba(0,0,0,0.12)',
            }}
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#DF8DFF]/25 via-[#3371FF]/20 to-[#FF4CAE]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            <span className="relative z-10">
              <ZainBotIcon size={40} />
            </span>
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[360px] flex flex-col rounded-2xl shadow-2xl border border-black/10 overflow-hidden"
          style={{ maxHeight: minimised ? '56px' : '520px', transition: 'max-height 0.2s ease' }}>

          {/* Header */}
          <div className="bg-[#007AFF] px-4 py-3 flex items-center justify-between shrink-0">
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
              <button
                onClick={() => setMinimised(m => !m)}
                aria-label={minimised ? 'Expand Zain chat' : 'Minimise Zain chat'}
                className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <ChevronDown size={15} className={`transition-transform ${minimised ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => { setOpen(false); setMinimised(false); }}
                aria-label="Close Zain chat"
                className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <X size={15} />
              </button>
            </div>
          </div>

          {!minimised && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-white p-4 space-y-3" style={{ maxHeight: '360px' }}>
                {visibleMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === 'assistant'
                        ? 'bg-[#f5f5f7] text-black rounded-tl-sm'
                        : 'bg-[#007AFF] text-white rounded-tr-sm'
                    }`}>
                      <p className="text-[13px] leading-[1.5] whitespace-pre-line">{renderText(msg.text)}</p>
                    </div>
                  </div>
                ))}
                {showTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#f5f5f7] rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                {errorMessage && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 bg-red-50 text-red-700 border border-red-100">
                      <p className="text-[12px] leading-[1.5]">
                        Zain could not connect. {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick chips */}
              {showQuickChips && (
                <div className="bg-white border-t border-black/5 px-3 py-2 flex flex-wrap gap-2">
                  {quickChips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => sendText(chip)}
                      className="text-[11px] font-medium text-[#007AFF] border border-[#007AFF]/30 px-2.5 py-1 rounded-full hover:bg-[#007AFF]/8 transition-colors whitespace-nowrap"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="bg-white border-t border-black/8 p-3 flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      send();
                    }
                  }}
                  disabled={isBusy}
                  placeholder="Ask Zain anything…"
                  className="flex-1 bg-[#f5f5f7] border-0 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#007AFF]/20 placeholder-[#86868b] disabled:opacity-70"
                />
                <button
                  onClick={send}
                  disabled={isBusy || !input.trim()}
                  aria-label="Send message to Zain"
                  className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white hover:bg-[#0051D5] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
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
