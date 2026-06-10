export type CartItem = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  logo: string;
  category: string;
  gcPrice: number;
  currency: 'USD' | 'AED';
  addedAt: string;
};

const KEY = 'zg_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function addToCart(item: CartItem): void {
  const existing = getCart();
  if (existing.find(i => i.id === item.id)) return; // already in cart
  localStorage.setItem(KEY, JSON.stringify([...existing, item]));
  window.dispatchEvent(new Event('zg-cart-updated'));
}

export function removeFromCart(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(getCart().filter(i => i.id !== id)));
  window.dispatchEvent(new Event('zg-cart-updated'));
}

export function isInCart(id: string): boolean {
  return getCart().some(i => i.id === id);
}

export function getCartCount(): number {
  return getCart().length;
}
