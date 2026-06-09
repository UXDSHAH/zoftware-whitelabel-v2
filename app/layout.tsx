import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Software Gateway — Powered by Zoftware',
  description: 'Discover, compare, and purchase 50+ business software tools. AI-powered recommendations, pre-built bundles, GCC pricing.',
};

// Root layout is intentionally minimal — each section manages its own navigation.
// Dubai Chamber page: full standalone nav/footer
// Software/Bundles/Checkout: slim gateway header (see software/layout.tsx)
// Old Zoftware pages (products, compare): legacy standalone
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
