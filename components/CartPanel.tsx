'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingCart, ArrowRight, Trash2, Package } from 'lucide-react';
import { getCart, removeFromCart, type CartItem } from '@/lib/cart';

interface CartPanelProps {
  onClose: () => void;
}

export default function CartPanel({ onClose }: CartPanelProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
    const handler = () => setItems(getCart());
    window.addEventListener('zg-cart-updated', handler);
    return () => window.removeEventListener('zg-cart-updated', handler);
  }, []);

  const remove = (id: string) => removeFromCart(id);

  const total = items.reduce((s, i) => s + i.gcPrice, 0);

  return (
    <>
      {/* Scrim */}
      <div className="fixed inset-0 z-[54] bg-black/20 backdrop-blur-[1px]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-screen z-[55] flex flex-col bg-white border-l border-black/10 shadow-2xl"
        style={{ width: 'min(400px, 95vw)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/8 shrink-0"
          style={{ background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 100%)' }}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <ShoppingCart size={15} className="text-white" />
          </div>
          <p className="text-[14px] font-semibold text-white flex-1">Cart ({items.length})</p>
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
              <div key={item.id} className="flex items-center gap-3 border border-zinc-100 rounded-xl p-3 bg-zinc-50/50 hover:bg-white hover:border-zinc-200 transition-all">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-[11px] font-bold text-zinc-700">
                  {item.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{item.vendor} · {item.category}</p>
                  <p className="text-[12px] font-semibold text-accent mt-0.5">${item.gcPrice}/mo</p>
                </div>
                <button onClick={() => remove(item.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-4 py-4 space-y-3 shrink-0 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-zinc-500">Total (monthly)</span>
              <span className="text-[18px] font-bold text-zinc-900">${total}/mo</span>
            </div>
            <Link href={`/checkout?product=${encodeURIComponent(items[0]?.name)}&price=${items[0]?.gcPrice}&billing=monthly&currency=USD&offerCode=${items[0]?.slug}-gcc`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white text-[13px] font-bold rounded-xl hover:bg-accent-hover transition-colors">
              Proceed to Checkout <ArrowRight size={14} />
            </Link>
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
