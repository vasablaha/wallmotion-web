// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook called')
  
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')
    
    console.log('🔔 Webhook signature exists:', !!sig)
    console.log('🔔 Webhook secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET)
    
    // Pokud nemáš webhook secret, zatím jen loguj
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('⚠️ No webhook secret configured, just logging the event')
      console.log('📦 Webhook body preview:', body.substring(0, 200))
      return NextResponse.json({ received: true, note: 'No webhook secret configured' })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET)
      console.log('✅ Webhook event verified:', event.type)
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('💰 Payment successful for session:', session.id)
      
      // Get customer email
      const customerEmail = session.customer_email || session.customer_details?.email
      console.log('📧 Customer email:', customerEmail)
      
      if (customerEmail) {
        console.log('📧 Would send download email to:', customerEmail)
        // TODO: Send download email when email system is configured
        // await sendDownloadEmail({
        //   email: customerEmail,
        //   sessionId: session.id,
        //   downloadUrl: process.env.DOWNLOAD_URL!,
        // })
      }
    } else {
      console.log('📝 Received webhook event:', event.type)
    }

    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('💥 Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}