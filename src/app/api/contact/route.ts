import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Optional: Forward form data to your WordPress backend REST endpoint or mail service
    // const wpRes = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/contact-submissions`, { ... })

    console.log('Received Form Submission:', body);

    return NextResponse.json({ success: true, message: 'Inquiry received successfully' });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}