'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type Vapi from '@vapi-ai/web';
import { MessageSquare, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeOff, X } from 'lucide-react';
import ZainBotIcon from './ZainBotIcon';

type CallStatus = 'idle' | 'loading' | 'connecting' | 'active' | 'ended';
type TranscriptRole = 'user' | 'assistant';

type TranscriptMessage = {
  id: number;
  role: TranscriptRole;
  transcript: string;
};

type FinalTranscriptMessage = {
  type: 'transcript';
  transcriptType: 'final';
  role?: string;
  transcript?: string;
};

const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_API_ASSISTANT_ID;
const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_API_KEY;
const isVoiceConfigured = Boolean(ASSISTANT_ID && VAPI_PUBLIC_KEY);

const opacities = [
  1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
  1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
];

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function isFinalTranscriptMessage(message: unknown): message is FinalTranscriptMessage {
  if (!message || typeof message !== 'object') return false;
  const candidate = message as Partial<FinalTranscriptMessage>;
  return (
    candidate.type === 'transcript' &&
    candidate.transcriptType === 'final' &&
    typeof candidate.transcript === 'string'
  );
}

function normalizeRole(role: string | undefined): TranscriptRole {
  return role === 'user' ? 'user' : 'assistant';
}

function extractErrorMessage(error: unknown) {
  if (!error) return 'Unable to start the call.';
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  if (typeof error === 'object') {
    const candidate = error as {
      message?: unknown;
      error?: { errorMsg?: unknown; message?: unknown } | string;
    };

    if (typeof candidate.error === 'object') {
      if (typeof candidate.error.errorMsg === 'string') return candidate.error.errorMsg;
      if (typeof candidate.error.message === 'string') return candidate.error.message;
    }

    if (typeof candidate.error === 'string') return candidate.error;
    if (typeof candidate.message === 'string') return candidate.message;
  }

  return 'Unable to start the call.';
}

function getCallContext() {
  if (typeof window === 'undefined') {
    return {
      pagePath: '',
      pageUrl: '',
      productId: '',
      productName: 'Zoftware services',
    };
  }

  const url = new URL(window.location.href);
  const heading = document.querySelector('h1')?.textContent?.trim();
  const productName =
    url.searchParams.get('product_name')?.trim() ||
    url.searchParams.get('product')?.trim() ||
    heading ||
    document.title ||
    'Zoftware services';

  return {
    pagePath: url.pathname,
    pageUrl: url.href,
    productId: url.searchParams.get('product_id')?.trim() || '',
    productName,
  };
}

export default function ZainVoiceCall({ onClose }: { onClose: () => void }) {
  const [callStatus, setCallStatus] = useState<CallStatus>(isVoiceConfigured ? 'loading' : 'idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVolumeMuted, setIsVolumeMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState(isVoiceConfigured ? '' : 'Voice assistant is not configured yet.');

  const vapiRef = useRef<Vapi | null>(null);
  const messageIdRef = useRef(0);
  const accumulatedTranscriptRef = useRef<{ role: TranscriptRole; text: string } | null>(null);
  const mutedAudioElementsRef = useRef<Array<{ audio: HTMLAudioElement; muted: boolean }>>([]);
  const transcriptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitAccumulatedTranscript = useCallback(() => {
    const accumulated = accumulatedTranscriptRef.current;
    if (!accumulated?.text.trim()) return;

    messageIdRef.current += 1;
    setMessages(prev => [
      ...prev,
      {
        id: messageIdRef.current,
        role: accumulated.role,
        transcript: accumulated.text.trim(),
      },
    ]);
    accumulatedTranscriptRef.current = null;
  }, []);

  const restoreMutedAudio = useCallback(() => {
    mutedAudioElementsRef.current.forEach(({ audio, muted }) => {
      if (audio.isConnected) audio.muted = muted;
    });
    mutedAudioElementsRef.current = [];
  }, []);

  useEffect(() => {
    let disposed = false;

    if (!isVoiceConfigured) return undefined;

    async function setupVapi() {
      try {
        const { default: VapiClient } = await import('@vapi-ai/web');
        if (disposed || !VAPI_PUBLIC_KEY) return;

        const vapi = new VapiClient(VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;
        setCallStatus('idle');

        vapi.on('call-start', () => {
          setCallStatus('active');
          setElapsedTime(0);
          setErrorMessage('');
          setIsMuted(false);
        });

        vapi.on('call-end', () => {
          commitAccumulatedTranscript();
          restoreMutedAudio();
          setCallStatus('ended');
          setIsSpeaking(false);
          setIsMuted(false);
          setIsVolumeMuted(false);

          if (transcriptTimeoutRef.current) {
            clearTimeout(transcriptTimeoutRef.current);
            transcriptTimeoutRef.current = null;
          }

          if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
          statusTimeoutRef.current = setTimeout(() => {
            setCallStatus('idle');
          }, 1600);
        });

        vapi.on('message', message => {
          if (!isFinalTranscriptMessage(message)) return;

          const role = normalizeRole(message.role);
          const transcript = message.transcript?.trim();
          if (!transcript) return;

          if (transcriptTimeoutRef.current) clearTimeout(transcriptTimeoutRef.current);

          if (accumulatedTranscriptRef.current && accumulatedTranscriptRef.current.role !== role) {
            commitAccumulatedTranscript();
          }

          if (!accumulatedTranscriptRef.current) {
            accumulatedTranscriptRef.current = { role, text: transcript };
          } else {
            accumulatedTranscriptRef.current.text += ` ${transcript}`;
          }

          transcriptTimeoutRef.current = setTimeout(() => {
            commitAccumulatedTranscript();
          }, 900);
        });

        vapi.on('speech-start', () => setIsSpeaking(true));
        vapi.on('speech-end', () => setIsSpeaking(false));
        vapi.on('error', error => {
          console.error('Vapi voice call failed', error);
          restoreMutedAudio();
          setErrorMessage(extractErrorMessage(error));
          setCallStatus('idle');
          setIsSpeaking(false);
          setIsMuted(false);
          setIsVolumeMuted(false);
        });
      } catch (error) {
        console.error('Failed to load Vapi SDK', error);
        setCallStatus('idle');
        setErrorMessage(extractErrorMessage(error));
      }
    }

    void setupVapi();

    return () => {
      disposed = true;
      if (transcriptTimeoutRef.current) clearTimeout(transcriptTimeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
      restoreMutedAudio();
      vapiRef.current?.removeAllListeners();
      void vapiRef.current?.stop().catch(() => undefined);
      vapiRef.current = null;
    };
  }, [commitAccumulatedTranscript, restoreMutedAudio]);

  useEffect(() => {
    if (callStatus !== 'active') return undefined;

    const interval = setInterval(() => {
      setElapsedTime(current => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus]);

  const startCall = async () => {
    if (!ASSISTANT_ID || !VAPI_PUBLIC_KEY) {
      setErrorMessage('Voice assistant is not configured yet.');
      return;
    }

    const vapi = vapiRef.current;
    if (!vapi) {
      setErrorMessage('Voice assistant is still loading.');
      return;
    }

    const context = getCallContext();
    setErrorMessage('');
    setMessages([]);
    setShowTranscript(true);
    setElapsedTime(0);
    setCallStatus('connecting');

    try {
      await vapi.start(ASSISTANT_ID, {
        metadata: {
          source: 'zoftware-whitelabel-v2',
          pagePath: context.pagePath,
          pageUrl: context.pageUrl,
          productId: context.productId,
          productName: context.productName,
        },
        variableValues: {
          productName: context.productName,
          pagePath: context.pagePath,
        },
      });
    } catch (error) {
      console.error('Failed to start Vapi voice call', error);
      setErrorMessage(extractErrorMessage(error));
      setCallStatus('idle');
      setIsSpeaking(false);
    }
  };

  const endCall = () => {
    restoreMutedAudio();
    setCallStatus('ended');
    setIsSpeaking(false);
    void vapiRef.current?.stop().catch(() => undefined);
  };

  const closeCall = () => {
    restoreMutedAudio();
    void vapiRef.current?.stop().catch(() => undefined);
    onClose();
  };

  const toggleMute = () => {
    const vapi = vapiRef.current;
    if (!vapi || callStatus !== 'active') return;

    const nextMuted = !isMuted;
    vapi.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const toggleVolume = () => {
    if (callStatus !== 'active') return;

    const nextMuted = !isVolumeMuted;
    if (nextMuted) {
      mutedAudioElementsRef.current = Array.from(document.querySelectorAll('audio')).map(audio => ({
        audio,
        muted: audio.muted,
      }));
      mutedAudioElementsRef.current.forEach(({ audio }) => {
        audio.muted = true;
      });
    } else {
      restoreMutedAudio();
    }

    setIsVolumeMuted(nextMuted);
  };

  const activeCall = callStatus === 'connecting' || callStatus === 'active';
  const canStart = callStatus === 'idle' || callStatus === 'ended';
  const statusText =
    callStatus === 'loading'
      ? 'Loading'
      : callStatus === 'connecting'
        ? 'Connecting'
        : callStatus === 'active'
          ? isSpeaking
            ? 'Speaking'
            : 'Listening'
          : callStatus === 'ended'
            ? 'Ended'
            : isVoiceConfigured
              ? 'Ready'
              : 'Unavailable';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="zain-voice-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.76)', backdropFilter: 'blur(14px)' }}
    >
      <style>{`
        @keyframes zain-voice-wave {
          0%, 100% { transform: scaleY(.35); }
          50% { transform: scaleY(1); }
        }

        .zain-voice-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .zain-voice-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(81, 162, 255, .5);
          border-radius: 999px;
        }
      `}</style>

      <div className="relative w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-[#101318] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <ZainBotIcon size={28} />
            </div>
            <div>
              <p id="zain-voice-title" className="text-[13px] font-semibold text-white">Zain from Zoftware</p>
              <p className="text-[11px] text-white/45">Senior Software Advisor</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCall}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close voice call"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-h-[460px] flex-col items-center justify-center px-5 py-8 text-center">
            <div className="relative mb-7 flex h-40 w-40 items-center justify-center">
              {activeCall && (
                <>
                  <div className="absolute inset-0 rounded-full bg-[#3371FF]/25 blur-2xl" />
                  <div className="absolute inset-2 rounded-full border border-[#51A2FF]/35 animate-ping" />
                </>
              )}
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white shadow-[0_18px_80px_rgba(51,113,255,0.28)]">
                <ZainBotIcon size={92} />
              </div>
            </div>

            <div className="mb-5 flex h-[34px] items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4">
              <span className={`h-1.5 w-1.5 rounded-full ${activeCall ? 'animate-pulse bg-[#10B981]' : 'bg-white/30'}`} />
              <span className="text-[13px] font-medium text-white/70">
                {callStatus === 'active' ? formatTime(elapsedTime) : statusText}
              </span>
            </div>

            <div className="mb-7 flex h-10 w-full max-w-[360px] items-center justify-center gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[40%] w-1 rounded-full bg-[#51A2FF] shadow-[0_0_12px_rgba(81,162,255,0.55)]"
                  style={{
                    opacity: opacities[i % opacities.length],
                    animation: `zain-voice-wave ${isSpeaking ? 520 : 1100}ms ease-in-out ${(i + 1) * 55}ms infinite`,
                    animationPlayState: activeCall && !isMuted ? 'running' : 'paused',
                  }}
                />
              ))}
            </div>

            <div className="flex w-full max-w-[420px] items-center justify-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={toggleMute}
                disabled={callStatus !== 'active'}
                className={`flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 transition-all ${
                  callStatus !== 'active'
                    ? 'cursor-not-allowed bg-white/5 text-white/30'
                    : isMuted
                      ? 'bg-[#EF4444]/20 text-red-200 hover:bg-[#EF4444]/30'
                      : 'bg-white/8 text-white hover:bg-white/14'
                }`}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                type="button"
                onClick={activeCall ? endCall : startCall}
                disabled={!isVoiceConfigured || callStatus === 'loading' || callStatus === 'connecting'}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl transition-all ${
                  activeCall
                    ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                    : canStart && isVoiceConfigured
                      ? 'bg-[#10B981] hover:bg-[#059669]'
                      : 'cursor-not-allowed bg-white/10 text-white/40'
                }`}
                aria-label={activeCall ? 'End voice call' : 'Start voice call'}
              >
                {activeCall ? <PhoneOff size={22} /> : <Phone size={22} />}
              </button>

              <button
                type="button"
                onClick={toggleVolume}
                disabled={callStatus !== 'active'}
                className={`flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 transition-all ${
                  callStatus !== 'active'
                    ? 'cursor-not-allowed bg-white/5 text-white/30'
                    : isVolumeMuted
                      ? 'bg-[#EF4444]/20 text-red-200 hover:bg-[#EF4444]/30'
                      : 'bg-white/8 text-white hover:bg-white/14'
                }`}
                aria-label={isVolumeMuted ? 'Unmute speaker' : 'Mute speaker'}
              >
                {isVolumeMuted ? <VolumeOff size={18} /> : <Volume2 size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setShowTranscript(value => !value)}
                disabled={messages.length === 0}
                className={`flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 transition-all lg:hidden ${
                  messages.length === 0
                    ? 'cursor-not-allowed bg-white/5 text-white/30'
                    : showTranscript
                      ? 'bg-[#3371FF]/25 text-white hover:bg-[#3371FF]/35'
                      : 'bg-white/8 text-white hover:bg-white/14'
                }`}
                aria-label={showTranscript ? 'Hide transcript' : 'Show transcript'}
              >
                <MessageSquare size={18} />
              </button>
            </div>

            {errorMessage && (
              <p className="mt-5 max-w-[420px] rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-[12px] leading-5 text-red-100">
                {errorMessage}
              </p>
            )}
          </div>

          <div className={`${showTranscript ? 'block' : 'hidden'} border-t border-white/10 bg-black/18 p-4 lg:block lg:border-l lg:border-t-0`}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] font-semibold text-white/70">Transcript</p>
              <button
                type="button"
                onClick={() => setShowTranscript(value => !value)}
                disabled={messages.length === 0}
                className="hidden h-7 w-7 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
                aria-label={showTranscript ? 'Hide transcript' : 'Show transcript'}
              >
                <MessageSquare size={14} />
              </button>
            </div>

            <div className="zain-voice-scroll h-[220px] space-y-3 overflow-y-auto pr-1 lg:h-[414px]">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
                  <p className="text-[12px] leading-5 text-white/35">Transcript appears when the call starts.</p>
                </div>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                        message.role === 'user'
                          ? 'rounded-tr-sm bg-[#3371FF] text-white'
                          : 'rounded-tl-sm bg-white/10 text-white/85'
                      }`}
                    >
                      <p className="text-[12px] leading-5">{message.transcript}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
