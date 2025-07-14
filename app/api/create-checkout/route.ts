import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validateCognitoToken } from '@/lib/auth-cognito'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: NextRequest) {
  try {
    console.log('🔥 API /api/create-checkout called')
    
    // Validace přihlášeného uživatele
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Musíte se přihlásit' }, { status: 401 })
    }
    
    console.log('✅ User authenticated:', auth.email)
    console.log('📊 Current licenses count:', auth.user.licensesCount || 0)
    
    const body = await req.json()
    const priceId = body?.priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
    
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

    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    console.log('🌐 Origin:', origin)

    console.log('🎯 Creating Stripe checkout session...')
    
    // Určení textu podle toho, zda už má uživatel licence
    const currentLicenses = auth.user.licensesCount || 0
    const isFirstLicense = currentLicenses === 0
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/profile`,
      customer_email: auth.email,
      billing_address_collection: 'required',
      metadata: {
        cognitoId: auth.cognitoId, // Klíčové pro webhook
        userEmail: auth.email,
        currentLicensesCount: currentLicenses.toString(),
        isFirstLicense: isFirstLicense.toString()
      }
    })

    console.log('✅ Checkout session created:', session.id)
    console.log(`📝 Metadata: First license: ${isFirstLicense}, Current count: ${currentLicenses}`)
    
    return NextResponse.json({ 
      sessionId: session.id 
    })
    
  } catch (error: unknown) {
    console.error('💥 API Error:', error)
    
    // Stripe error handling
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

// OPTIONS handler pro CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}