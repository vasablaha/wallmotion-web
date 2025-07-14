import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown webhook error'
      console.error('❌ Webhook signature verification failed:', errorMessage)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('💰 Payment successful for session:', session.id)
      
      const cognitoId = session.metadata?.cognitoId
      const customerEmail = session.customer_email || session.customer_details?.email
      
      console.log('👤 Cognito ID:', cognitoId)
      console.log('📧 Customer email:', customerEmail)
      
      if (cognitoId && session.payment_status === 'paid') {
        try {
          await dbConnect()
          
          // Aktivace licence
          const updateResult = await User.updateOne(
            { cognitoId },
            {
              licenseType: 'LIFETIME',
              purchaseDate: new Date(),
              stripeCustomerId: session.customer as string
            }
          )
          
          if (updateResult.matchedCount > 0) {
            console.log(`✅ Licence aktivována pro Cognito ID: ${cognitoId}`)
            
            // TODO: Odeslání emailu s download linkem
            if (customerEmail) {
              console.log('📧 Would send download email to:', customerEmail)
              // await sendDownloadEmail({
              //   email: customerEmail,
              //   downloadUrl: process.env.DOWNLOAD_URL!,
              // })
            }
          } else {
            console.error(`❌ User not found for Cognito ID: ${cognitoId}`)
          }
        } catch (dbError) {
          console.error('❌ Database update failed:', dbError)
        }
      } else {
        console.log('⚠️ Missing cognitoId in metadata or payment not completed')
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