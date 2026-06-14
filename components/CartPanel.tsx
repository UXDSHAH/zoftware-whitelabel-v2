'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingCart, ArrowRight, Trash2, Plus, Minus, Tag, Check, AlertCircle } from 'lucide-react';
import { getCart, removeFromCart, updateQty, clearCart, savePromo, getPromo, clearPromo, PROMO_CODES, type CartItem } from '@/lib/cart';

interface CartPanelProps { onClose: () => void; }

export default function CartPanel({ onClose }: CartPanelProps) {
  const router = useRouter();
  const [items, setItems]         = useState<CartItem[]>([]);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError]     = useState('');

  useEffect(() => {
    setItems(getCart());
    setAppliedPromo(getPromo());
    const handler = () => setItems(getCart());
    window.addEventListener('zg-cart-updated', handler);
    return () => window.removeEventListener('zg-cart-updated', handler);
  }, []);

  const promoData   = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const subtotal    = items.reduce((s, i) => s + i.gcPrice * (i.qty || 1), 0);
  const discount    = promoData ? Math.round(subtotal * promoData.discount) : 0;
  const total       = subtotal - discount;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      savePromo(code);
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const removePromo = () => {
    setAppliedPromo('');
    clearPromo();
    setPromoError('');
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout?fromCart=true');
  };

  return (
    <>
      <div className="fixed inset-0 z-[54] bg-black/20 backdrop-blur-[1px]" onClick={onClose} />

      <div className="fixed top-0 right-0 h-screen z-[55] flex flex-col bg-white border-l border-black/10 shadow-2xl"
        style={{ width: 'min(520px, 95vw)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/8 shrink-0"
          style={{ background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 100%)' }}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <ShoppingCart size={15} className="text-white" />
          </div>
          <p className="text-[14px] font-semibold text-white flex-1">
            Cart ({items.reduce((s, i) => s + (i.qty || 1), 0)} items)
          </p>
          {items.length > 0 && (
            <button onClick={() => { clearCart(); setAppliedPromo(''); }}
              className="text-[11px] text-white/40 hover:text-red-400 transition-colors mr-1">
              Clear all
            </button>
          )}
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <ShoppingCart size={32} strokeWidth={1.2} className="text-zinc-300 mb-3" />
              <p className="text-[14px] font-semibold text-zinc-700">Your cart is empty</p>
              <p className="text-[12px] text-zinc-400 mt-1">Browse software and add products here</p>
              <Link href="/software" onClick={onClose}
                className="mt-4 px-4 py-2 bg-accent text-white text-[12px] font-semibold rounded-xl hover:bg-accent-hover transition-colors">
                Browse Software
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="border border-zinc-100 rounded-xl p-3 bg-white hover:border-zinc-200 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-[11px] font-bold text-zinc-700">
                    {item.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{item.vendor} · {item.category}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">${item.gcPrice}/user/mo</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 mt-0.5">
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Quantity + line total */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] text-zinc-400 mr-1.5">Users:</span>
                    <button onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                      className="w-6 h-6 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                      <Minus size={10} />
                    </button>
                    <span className="w-8 text-center text-[13px] font-semibold text-zinc-900">{item.qty || 1}</span>
                    <button onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                      className="w-6 h-6 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                      <Plus size={10} />
                    </button>
                  </div>
                  <p className="text-[13px] font-bold text-accent">
                    ${(item.gcPrice * (item.qty || 1)).toLocaleString()}/mo
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-4 py-4 space-y-3 shrink-0 bg-white">

            {/* Promo code */}
            {appliedPromo && promoData ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Check size={13} className="text-green-600 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-green-700">{appliedPromo}</p>
                    <p className="text-[10px] text-green-600">{promoData.label}</p>
                  </div>
                </div>
                <button onClick={removePromo} className="text-[10px] text-red-400 hover:text-red-600 font-medium">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyPromo()}
                    placeholder="Promo code"
                    className="w-full pl-8 pr-3 py-2 text-[12px] border border-zinc-200 rounded-xl outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>
                <button onClick={applyPromo}
                  className="px-3 py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors shrink-0">
                  Apply
                </button>
              </div>
            )}
            {promoError && (
              <div className="flex items-center gap-1.5 text-[11px] text-red-500">
                <AlertCircle size={11} /> {promoError}
              </div>
            )}

            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px] text-zinc-500">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}/mo</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-[12px] text-green-600">
                  <span>Promo discount ({Math.round((promoData?.discount || 0) * 100)}%)</span>
                  <span>−${discount.toLocaleString()}/mo</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100">
                <span className="text-[14px] font-semibold text-zinc-900">Total</span>
                <span className="text-[20px] font-bold text-zinc-900">${total.toLocaleString()}<span className="text-[12px] font-normal text-zinc-400">/mo</span></span>
              </div>
            </div>

            <button onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white text-[13px] font-bold rounded-xl hover:bg-accent-hover transition-colors">
              Proceed to Checkout <ArrowRight size={14} />
            </button>
            <button onClick={onClose}
              className="w-full py-2.5 border border-zinc-200 text-zinc-600 text-[12px] font-semibold rounded-xl hover:bg-zinc-50 transition-colors">
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </>
  );
}
