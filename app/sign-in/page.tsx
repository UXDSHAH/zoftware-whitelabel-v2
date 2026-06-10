'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight, Mail, Lock, Building2, Shield, Check,
  ChevronRight, Zap, Eye, EyeOff
} from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/software';
  const source = searchParams.get('source') || '';

  const [mode, setMode] = useState<'choose' | 'email'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ssoLoading, setSsoLoading] = useState(false);

  // Auto-SSO if arriving directly from Dubai Chamber
  useEffect(() => {
    if (source === 'dubai-chamber') {
      setSsoLoading(true);
      setTimeout(() => {
        localStorage.setItem('dc_auth', JSON.stringify({
          name: 'Ravi Sharma', email: 'ravi.sharma@gulf-enterprises.ae',
          company: 'Gulf Enterprises LLC', source: 'dubai-chamber', loggedIn: true,
        }));
        document.cookie = 'zg_auth=1; path=/; max-age=86400; SameSite=Strict';
        router.push(redirect);
      }, 1800);
    }
  }, [source, redirect, router]);

  const handleDubaiSSO = () => {
    setSsoLoading(true);
    setTimeout(() => {
      localStorage.setItem('dc_auth', JSON.stringify({
        name: 'Ravi Sharma', email: 'ravi.sharma@gulf-enterprises.ae',
        company: 'Gulf Enterprises LLC', source: 'dubai-chamber', loggedIn: true,
      }));
      document.cookie = 'zg_auth=1; path=/; max-age=86400; SameSite=Strict';
      router.push(redirect);
    }, 1500);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) { setError('Enter a valid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('dc_auth', JSON.stringify({
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        email, company: '', source: 'direct', loggedIn: true,
      }));
      document.cookie = 'zg_auth=1; path=/; max-age=86400; SameSite=Strict';
      router.push(redirect);
    }, 1200);
  };

  // Full-screen SSO spinner (auto or manual)
  if (ssoLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            <Building2 size={22} className="text-white" />
          </div>
          <p className="text-[15px] font-semibold text-black mb-1">Signing you in via Dubai Chamber</p>
          <p className="text-[13px] text-muted mb-6">Fetching your member profile…</p>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-2 h-2 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px]">

        {/* Logo bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[2.5px]">
                {[0,1,2,3].map(i => <div key={i} className="w-[6px] h-[6px] bg-white rounded-[1px]" />)}
              </div>
            </div>
            <span className="text-[15px] font-bold text-black tracking-tight">LOGO</span>
          </div>
          <div className="w-px h-5 bg-black/12" />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-sm bg-accent flex items-center justify-center">
              <Zap size={11} strokeWidth={2} className="text-white" />
            </div>
            <span className="text-[13px] font-semibold text-black">Software Gateway</span>
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-sm shadow-sm overflow-hidden">

          {/* ── Choose mode ── */}
          {mode === 'choose' && (
            <div className="p-7">
              <h1 className="text-[22px] font-semibold text-black tracking-tight mb-1.5">Sign in to continue</h1>
              <p className="text-[13px] text-muted mb-7">
                Access your software purchases, reports, and GCC-exclusive deals.
              </p>

              {/* Dubai Chamber SSO — primary CTA */}
              <button onClick={handleDubaiSSO}
                className="w-full flex items-center gap-4 border-2 border-accent/25 bg-[#eff6ff] hover:bg-[#dbeafe] hover:border-accent/50 transition-all rounded-sm px-5 py-4 mb-4 text-left group">
                <div className="w-10 h-10 rounded-sm bg-accent flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-black">Continue with Dubai Chamber</p>
                  <p className="text-[11px] text-muted">Member SSO — your details are pre-loaded</p>
                </div>
                <ChevronRight size={16} className="text-accent group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Benefit pills */}
              <div className="flex items-center gap-4 px-4 py-2.5 bg-[#f9fafb] rounded-sm mb-5">
                {[
                  { icon: <Check size={10} className="text-accent" />, text: 'Profile auto-filled' },
                  { icon: <Check size={10} className="text-accent" />, text: 'Member pricing' },
                  { icon: <Check size={10} className="text-accent" />, text: 'Instant access' },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1 text-[11px] text-[#555] shrink-0">{icon}{text}</span>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-black/8" />
                <p className="text-[11px] text-muted font-medium">or sign in with email</p>
                <div className="flex-1 h-px bg-black/8" />
              </div>

              <button onClick={() => setMode('email')}
                className="w-full flex items-center justify-between border border-black/10 rounded-sm px-5 py-3.5 hover:bg-surface hover:border-black/20 transition-all group">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-muted" />
                  <span className="text-[13px] font-medium text-black">Email & password</span>
                </div>
                <ChevronRight size={14} className="text-muted group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-center text-[11px] text-muted mt-5">
                No account?{' '}
                <button onClick={() => setMode('email')} className="text-accent hover:underline font-medium">Create one free</button>
              </p>
            </div>
          )}

          {/* ── Email form ── */}
          {mode === 'email' && (
            <div className="p-7">
              <button onClick={() => setMode('choose')}
                className="text-[12px] text-muted hover:text-black transition-colors mb-5 flex items-center gap-1">
                ← Back
              </button>
              <h2 className="text-[20px] font-semibold text-black tracking-tight mb-1">Sign in with email</h2>
              <p className="text-[13px] text-muted mb-6">Enter your work email and password to continue.</p>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-1.5">Work Email</label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com" required
                      className="w-full border border-black/10 bg-[#fafafa] pl-9 pr-3.5 py-3 text-[13px] text-black placeholder-[#c7c7cc] outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 rounded-sm min-h-[44px] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full border border-black/10 bg-[#fafafa] pl-9 pr-10 py-3 text-[13px] text-black placeholder-[#c7c7cc] outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 rounded-sm min-h-[44px] transition-all" />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-black transition-colors">
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-[12px] text-red-500">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 text-[14px] font-semibold rounded-sm hover:bg-accent-hover transition-colors min-h-[48px] disabled:opacity-60">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Continue</span><ArrowRight size={14} strokeWidth={2} /></>}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-5 mt-5">
          {[
            { icon: <Shield size={11} />, text: 'GCC data residency' },
            { icon: <Lock size={11} />, text: 'SSL encrypted' },
            { icon: <Building2 size={11} />, text: 'Dubai Chamber partner' },
          ].map(({ icon, text }) => (
            <span key={text} className="flex items-center gap-1 text-[10px] text-muted">{icon}{text}</span>
          ))}
        </div>
        <p className="text-center text-[10px] text-muted mt-3">
          By continuing you agree to our <a href="#" className="underline hover:text-black">Terms</a> and <a href="#" className="underline hover:text-black">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[13px] text-muted">Loading…</div>}>
      <SignInContent />
    </Suspense>
  );
}
