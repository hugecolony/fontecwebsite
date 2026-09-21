// CoCart v2 — headless cart API for WooCommerce
// Stateless: cart identified by cart_key stored client-side

const COCART_BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/cocart/v2`;

interface AddItemPayload {
  id: string;
  quantity: string;
  cart_key?: string;
}

export async function getCart(cartKey?: string) {
  const params = cartKey ? `?cart_key=${cartKey}` : '';
  const res = await fetch(`${COCART_BASE}/cart${params}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function addToCart(
  productId: number,
  quantity: number,
  cartKey?: string
) {
  const body: AddItemPayload = {
    id: String(productId),
    quantity: String(quantity),
  };
  if (cartKey) body.cart_key = cartKey;

  const res = await fetch(`${COCART_BASE}/cart/add-item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to add item to cart');
  return res.json();
}

export async function updateCartItem(
  itemKey: string,
  quantity: number,
  cartKey: string
) {
  const res = await fetch(`${COCART_BASE}/cart/item/${itemKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: String(quantity), cart_key: cartKey }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to update cart item');
  return res.json();
}

export async function removeCartItem(itemKey: string, cartKey: string) {
  const res = await fetch(
    `${COCART_BASE}/cart/item/${itemKey}?cart_key=${cartKey}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    }
  );
  if (!res.ok) throw new Error('Failed to remove cart item');
  return res.json();
}

export async function clearCart(cartKey: string) {
  const res = await fetch(`${COCART_BASE}/cart/clear?cart_key=${cartKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  return res.json();
}
