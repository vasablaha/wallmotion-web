import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Zkontroluj, že máš Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: NextRequest) {
  console.log('🔥 API /api/create-checkout called')
  
  try {
    const body = await req.json()
    console.log('📦 Request body:', body)
    
    const priceId = body?.priceId
    console.log('💰 Price ID:', priceId)

    if (!priceId || typeof priceId !== 'string') {
      console.error('❌ Invalid priceId')
      return NextResponse.json(
        { error: 'Missing or invalid priceId' }, 
        { status: 400 }
      )
    }

    if (!priceId.startsWith('price_')) {
      console.error('❌ Invalid Price ID format')
      return NextResponse.json(
        { error: 'Invalid Price ID format - must start with price_' }, 
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    console.log('🌐 Origin:', origin)

    console.log('🎯 Creating Stripe checkout session...')
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      billing_address_collection: 'required',
    })

    console.log('✅ Checkout session created:', session.id)
    
    return NextResponse.json({ 
      sessionId: session.id 
    })
    
  } catch (error: unknown) {
    console.error('💥 API Error:', error)
    
    // Zkontroluj, jestli je to Stripe error
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as { type: string; message: string; code?: string }
      if (stripeError.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { 
            error: `Stripe Error: ${stripeError.message}`,
            code: stripeError.code 
          }, 
          { status: 400 }
        )
      }
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Unknown server error' }, 
      { status: 500 }
    )
  }
}

// Přidej OPTIONS handler pro CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}