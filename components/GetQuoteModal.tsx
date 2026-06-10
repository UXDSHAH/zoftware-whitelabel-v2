'use client';

import { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { createTicket } from '@/lib/zain-tickets';

interface GetQuoteModalProps {
  productName: string;
  onClose: () => void;
}

export default function GetQuoteModal({ productName, onClose }: GetQuoteModalProps) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', company: '', licenses: '5', message: '',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name || !form.email) return;
    createTicket(
      `Custom quote request — ${productName}`,
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nLicenses: ${form.licenses}\nMessage: ${form.message}`
    );
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100"
          style={{ background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 100%)' }}>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-white">Get a Custom Quote</p>
            <p className="text-[11px] text-white/50 mt-0.5">{productName}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <p className="text-[16px] font-semibold text-zinc-900 mb-2">Quote request sent!</p>
            <p className="text-[13px] text-zinc-500 leading-relaxed mb-5">
              Deepa Rawat from our team will reach out to you within 24 hours with a tailored plan.
            </p>
            <button onClick={onClose}
              className="px-6 py-2.5 bg-accent text-white text-[13px] font-semibold rounded-xl hover:bg-accent-hover transition-colors">
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Full Name *</label>
                <input value={form.name} onChange={e => set('name')(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-accent/50 bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Work Email *</label>
                <input value={form.email} onChange={e => set('email')(e.target.value)}
                  placeholder="you@company.com" type="email"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-accent/50 bg-zinc-50 focus:bg-white transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Company</label>
                <input value={form.company} onChange={e => set('company')(e.target.value)}
                  placeholder="Company name"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-accent/50 bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Licenses needed</label>
                <input value={form.licenses} onChange={e => set('licenses')(e.target.value)}
                  placeholder="e.g. 10" type="number" min="1"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-accent/50 bg-zinc-50 focus:bg-white transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Message (optional)</label>
              <textarea value={form.message} onChange={e => set('message')(e.target.value)}
                placeholder="Tell us about your requirements, timeline, or budget..."
                rows={3}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-accent/50 bg-zinc-50 focus:bg-white transition-colors resize-none" />
            </div>

            {/* Deepa contact */}
            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl p-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-[11px] font-bold shrink-0">DR</div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-zinc-900">Deepa Rawat</p>
                <p className="text-[10px] text-zinc-400">Customer Success Manager · Responds in &lt;24h</p>
              </div>
            </div>

            <button onClick={submit} disabled={!form.name || !form.email}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white text-[13px] font-bold rounded-xl hover:bg-accent-hover disabled:opacity-50 transition-colors">
              <Send size={13} /> Send Quote Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
