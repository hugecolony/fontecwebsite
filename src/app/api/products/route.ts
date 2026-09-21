import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const products = await getProducts(params);
    return NextResponse.json(products);
  } catch (error) {
    console.error('[API /products]', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
