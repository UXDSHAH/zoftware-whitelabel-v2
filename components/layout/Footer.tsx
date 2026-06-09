import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/8 bg-white mt-24">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src="/zoftware-logo.svg" alt="Zoftware" className="h-6 w-auto" />
            </div>
            <p className="text-[12px] text-muted leading-[1.6]">
              Discover, compare, and purchase the right software for your business.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">Platform</p>
            {['Browse Categories', 'Compare Products', 'AI Recommendations', 'Pricing'].map(l => (
              <Link key={l} href="#" className="block text-[13px] text-black hover:text-accent transition-colors mb-2">{l}</Link>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">Support</p>
            {['Help Centre', 'Schedule a Demo', 'Contact Us', 'System Status'].map(l => (
              <Link key={l} href="#" className="block text-[13px] text-black hover:text-accent transition-colors mb-2">{l}</Link>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.07em] mb-3">Company</p>
            {['About', 'Blog', 'Careers', 'Privacy Policy'].map(l => (
              <Link key={l} href="#" className="block text-[13px] text-black hover:text-accent transition-colors mb-2">{l}</Link>
            ))}
            <Link href="/partner" className="block text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors mb-2">Partner Program →</Link>
          </div>
        </div>
        <div className="border-t border-black/8 mt-10 pt-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[12px] text-muted">© 2026 Zoftware. All rights reserved.</p>
          <p className="text-[12px] text-muted">Powered by Zoftware · Trusted by 5,000+ businesses</p>
        </div>
      </div>
    </footer>
  );
}
