import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { products } from '@/data/products';

// Static demo: compare top 3 products
const compareProducts = products.slice(0, 3);

const allFeatures = Array.from(new Set(compareProducts.flatMap(p => p.features))).slice(0, 12);

export default function ComparePage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">

      <div className="mb-8">
        <Link href="/products" className="flex items-center gap-1.5 text-[12px] text-muted hover:text-black transition-colors mb-4 w-fit">
          <ArrowLeft size={12} /> Back to Browse
        </Link>
        <p className="text-[11px] font-semibold text-muted tracking-[0.1em] uppercase mb-1.5">Side-by-Side Analysis</p>
        <h1 className="text-[36px] font-medium text-black tracking-tight">Compare Software</h1>
      </div>

      {/* AI recommendation banner */}
      <div className="flex items-center justify-between bg-[#EBF1FD] border border-accent/20 rounded-sm px-5 py-3.5 mb-8">
        <p className="text-[13px] text-black">
          <span className="font-semibold text-accent">AI Recommendation:</span> Based on your profile,{' '}
          <span className="font-semibold">{compareProducts[0].name}</span> is the best fit —
          highest match score at {compareProducts[0].fitScore}%.
        </p>
        <Link href={`/products/${compareProducts[0].slug}`} className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:text-accent-hover transition-colors shrink-0 ml-4">
          View details <ArrowRight size={12} />
        </Link>
      </div>

      {/* Comparison table */}
      <div className="border border-black/8 rounded-sm overflow-hidden">

        {/* Header row */}
        <div className="grid border-b border-black/8" style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
          <div className="bg-[#f9fafb] p-4 border-r border-black/8">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em]">Product</p>
          </div>
          {compareProducts.map((p, i) => (
            <div key={p.id} className={`p-5 ${i < 2 ? 'border-r border-black/8' : ''} ${i === 0 ? 'bg-[#f0f7ff]' : 'bg-white'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-sm bg-surface border border-black/8 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-black">{p.logo}</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-black">{p.name}</p>
                  <p className="text-[11px] text-muted">{p.vendor}</p>
                </div>
              </div>
              {p.fitScore && (
                <div className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-surface text-muted'}`}>
                  {p.fitScore}% match
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rating row */}
        <div className="grid border-b border-black/8" style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
          <div className="bg-[#f9fafb] p-4 border-r border-black/8 flex items-center">
            <p className="text-[12px] font-semibold text-[#333333]">Rating</p>
          </div>
          {compareProducts.map((p, i) => (
            <div key={p.id} className={`p-4 flex items-center ${i < 2 ? 'border-r border-black/8' : ''} ${i === 0 ? 'bg-[#f0f7ff]' : ''}`}>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-[14px] ${s <= Math.round(p.rating) ? 'text-accent' : 'text-[#e5e5e7]'}`}>★</span>
                ))}
                <span className="text-[13px] font-semibold text-black ml-1">{p.rating}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Price row */}
        <div className="grid border-b border-black/8" style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
          <div className="bg-[#f9fafb] p-4 border-r border-black/8 flex items-center">
            <p className="text-[12px] font-semibold text-[#333333]">Starting Price</p>
          </div>
          {compareProducts.map((p, i) => (
            <div key={p.id} className={`p-4 flex items-center ${i < 2 ? 'border-r border-black/8' : ''} ${i === 0 ? 'bg-[#f0f7ff]' : ''}`}>
              <div>
                <p className="text-[14px] font-semibold text-black">{p.startingPrice === 0 ? 'Free' : `$${p.startingPrice}/mo`}</p>
                {p.startingPrice > 0 && <p className="text-[10px] text-muted">AED {Math.round(p.startingPrice * 3.67)}/mo</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Deployment row */}
        <div className="grid border-b border-black/8" style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
          <div className="bg-[#f9fafb] p-4 border-r border-black/8 flex items-center">
            <p className="text-[12px] font-semibold text-[#333333]">Deployment</p>
          </div>
          {compareProducts.map((p, i) => (
            <div key={p.id} className={`p-4 flex items-center ${i < 2 ? 'border-r border-black/8' : ''} ${i === 0 ? 'bg-[#f0f7ff]' : ''}`}>
              <span className="bg-surface text-[#333333] text-[11px] font-medium px-2.5 py-1 rounded-sm">{p.deployment}</span>
            </div>
          ))}
        </div>

        {/* Features rows */}
        {allFeatures.map((feature, idx) => (
          <div key={feature} className={`grid ${idx < allFeatures.length - 1 ? 'border-b border-black/8' : ''}`} style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
            <div className="bg-[#f9fafb] p-4 border-r border-black/8 flex items-center">
              <p className="text-[12px] text-[#555555]">{feature}</p>
            </div>
            {compareProducts.map((p, i) => {
              const has = p.features.includes(feature);
              return (
                <div key={p.id} className={`p-4 flex items-center ${i < 2 ? 'border-r border-black/8' : ''} ${i === 0 ? 'bg-[#f0f7ff]' : ''}`}>
                  {has
                    ? <Check size={15} className="text-accent" strokeWidth={2.5} />
                    : <X size={14} className="text-[#c7c7cc]" strokeWidth={2} />
                  }
                </div>
              );
            })}
          </div>
        ))}

        {/* CTA row */}
        <div className="grid border-t border-black/8 bg-[#f9fafb]" style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}>
          <div className="p-4 border-r border-black/8" />
          {compareProducts.map((p, i) => (
            <div key={p.id} className={`p-4 ${i < 2 ? 'border-r border-black/8' : ''}`}>
              <Link
                href={`/products/${p.slug}`}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-[12px] font-medium rounded-sm transition-colors ${i === 0 ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-white text-black border border-black/10 hover:bg-surface'}`}
              >
                {i === 0 ? 'Buy Now' : 'View Details'} <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
