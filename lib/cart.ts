export type CartItem = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  logo: string;
  category: string;
  gcPrice: number;   // unit price per license per month
  currency: 'USD' | 'AED';
  qty: number;       // number of licenses
  addedAt: string;
};

const KEY       = 'zg_cart';
const PROMO_KEY = 'zg_promo';

// Valid promo codes
export const PROMO_CODES: Record<string, { label: string; discount: number }> = {
  'DUBAI10':  { label: '10% off — Dubai Chamber member',  discount: 0.10 },
  'GCC20':    { label: '20% off — GCC launch offer',      discount: 0.20 },
  'ZOFT15':   { label: '15% off — Zoftware partner',      discount: 0.15 },
  'WELCOME5': { label: '5% off — Welcome discount',       discount: 0.05 },
};

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function addToCart(item: Omit<CartItem, 'qty'> & { qty?: number }): void {
  const existing = getCart();
  const found = existing.find(i => i.id === item.id);
  if (found) {
    found.qty = Math.min(500, (found.qty || 1) + 1);
    localStorage.setItem(KEY, JSON.stringify(existing));
  } else {
    localStorage.setItem(KEY, JSON.stringify([...existing, { ...item, qty: item.qty ?? 1 }]));
  }
  window.dispatchEvent(new Event('zg-cart-updated'));
}

export function removeFromCart(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(getCart().filter(i => i.id !== id)));
  window.dispatchEvent(new Event('zg-cart-updated'));
}

export function updateQty(id: string, qty: number): void {
  if (qty < 1) { removeFromCart(id); return; }
  const cart = getCart().map(i => i.id === id ? { ...i, qty: Math.min(500, qty) } : i);
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('zg-cart-updated'));
}

export function clearCart(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('zg-cart-updated'));
}

export function isInCart(id: string): boolean {
  return getCart().some(i => i.id === id);
}

export function getCartCount(): number {
  return getCart().reduce((s, i) => s + (i.qty || 1), 0);
}

export function getCartTotal(): number {
  return getCart().reduce((s, i) => s + i.gcPrice * (i.qty || 1), 0);
}

export function savePromo(code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROMO_KEY, code.toUpperCase());
}

export function getPromo(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(PROMO_KEY) || '';
}

export function clearPromo(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROMO_KEY);
}
