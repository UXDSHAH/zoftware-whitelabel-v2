import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that do NOT require auth
const PUBLIC_PREFIXES = [
  '/dubai-chamber',
  '/sign-in',
  '/_next',
  '/api',
  '/logos',
  '/zain-avatar',
  '/zain-bot',
  '/zoftware-logo',
  '/favicon',
  '/file',
  '/globe',
  '/vercel',
  '/window',
  '/next',
  '/data-direct-logo',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root redirects to dubai-chamber (handled by page.tsx, allow through)
  if (pathname === '/') return NextResponse.next();

  // Allow public paths
  if (PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check auth cookie
  const auth = request.cookies.get('zg_auth')?.value;
  if (auth === '1') return NextResponse.next();

  // Not authenticated — redirect to login
  const url = request.nextUrl.clone();
  url.pathname = '/dubai-chamber';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
