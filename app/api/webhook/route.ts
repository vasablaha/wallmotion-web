// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendDownloadEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Get customer email
    const customerEmail = session.customer_email || session.customer_details?.email
    
    if (customerEmail) {
      // Send download email
      await sendDownloadEmail({
        email: customerEmail,
        sessionId: session.id,
        downloadUrl: process.env.DOWNLOAD_URL!, // Your .dmg file URL
      })
      
      console.log('Download email sent to:', customerEmail)
    }
  }

  return NextResponse.json({ received: true })
}