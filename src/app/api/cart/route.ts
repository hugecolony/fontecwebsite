import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, removeCartItem, updateCartItem, clearCart } from '@/lib/cocart';

export async function GET(req: NextRequest) {
  try {
    const cartKey = req.nextUrl.searchParams.get('cart_key') ?? undefined;
    const cart = await getCart(cartKey);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('[API GET /cart]', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, product_id, quantity, item_key, cart_key } = body;

    switch (action) {
      case 'add': {
        const result = await addToCart(product_id, quantity ?? 1, cart_key);
        return NextResponse.json(result);
      }
      case 'update': {
        const result = await updateCartItem(item_key, quantity, cart_key);
        return NextResponse.json(result);
      }
      case 'remove': {
        const result = await removeCartItem(item_key, cart_key);
        return NextResponse.json(result);
      }
      case 'clear': {
        const result = await clearCart(cart_key);
        return NextResponse.json(result);
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[API POST /cart]', error);
    return NextResponse.json({ error: 'Cart operation failed' }, { status: 500 });
  }
}
