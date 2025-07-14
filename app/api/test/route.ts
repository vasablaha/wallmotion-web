import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API funguje!',
    timestamp: new Date().toISOString(),
    env: {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasPriceId: !!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    }
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ 
    message: 'POST funguje!',
    receivedData: body,
    timestamp: new Date().toISOString()
  })
}