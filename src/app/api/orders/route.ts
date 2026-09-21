import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrder } from '@/lib/woocommerce';
import type { CreateOrderPayload } from '@/types/order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { billing, line_items } = body;
    if (!billing?.first_name || !billing?.email || !billing?.phone) {
      return NextResponse.json(
        { error: 'Missing required billing fields' },
        { status: 400 }
      );
    }
    if (!line_items?.length) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const payload: CreateOrderPayload = {
      payment_method: 'cod',
      payment_method_title: 'Cash on Delivery',
      set_paid: false,
      billing: body.billing,
      shipping: body.shipping ?? body.billing,
      line_items: body.line_items,
      shipping_lines: body.shipping_lines ?? [
        {
          method_id: 'flat_rate',
          method_title: 'Standard Shipping',
          total: '0.00',
        },
      ],
      customer_note: body.customer_note ?? '',
    };

    const order = await createOrder(payload);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('[API POST /orders]', error);
    const msg = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }
    const order = await getOrder(Number(id));
    return NextResponse.json(order);
  } catch (error) {
    console.error('[API GET /orders]', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
