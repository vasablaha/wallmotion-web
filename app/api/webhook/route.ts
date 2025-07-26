import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import nodemailer from 'nodemailer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

// Seznam.cz email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.seznam.cz',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.SEZNAM_EMAIL_USER,
    pass: process.env.SEZNAM_EMAIL_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook called')
  
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')
    
    console.log('🔔 Webhook signature exists:', !!sig)
    console.log('🔔 Webhook secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET)
    
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
      const stripeCustomerId = session.customer as string || session.metadata?.stripeCustomerId
      
      console.log('👤 Cognito ID:', cognitoId)
      console.log('📧 Customer email:', customerEmail)
      console.log('🆔 Stripe Customer ID:', stripeCustomerId)
      
      if (cognitoId && session.payment_status === 'paid') {
        try {
          await dbConnect()
          
          // Najít uživatele
          const user = await User.findOne({ cognitoId })
          
          if (!user) {
            console.error(`❌ User not found for Cognito ID: ${cognitoId}`)
            return NextResponse.json({ received: true })
          }
          
          // Zvýšit počet licencí o 1
          const newLicensesCount = (user.licensesCount || 0) + 1

          type UpdateData = {
            licensesCount: number
            stripeCustomerId?: string
            licenseType?: 'LIFETIME'
            purchaseDate?: Date
          }

          // Aktivace licence
          const updateData: UpdateData = {
            licensesCount: newLicensesCount,
          }

          // Uložit Stripe Customer ID
          if (stripeCustomerId) {
            updateData.stripeCustomerId = stripeCustomerId
          }
          
          // Pokud je to první licence, nastav licenseType a purchaseDate
          if (user.licenseType === 'NONE') {
            updateData.licenseType = 'LIFETIME'
            updateData.purchaseDate = new Date()
          }
          
          const updateResult = await User.updateOne(
            { cognitoId },
            updateData
          )
          
          if (updateResult.matchedCount > 0) {
            console.log(`✅ Licence aktivována pro Cognito ID: ${cognitoId}`)
            console.log(`📊 Nový počet licencí: ${newLicensesCount}`)
            console.log(`🆔 Stripe Customer ID uložen: ${stripeCustomerId}`)
            
            // Odeslání emailu s potvrzením přes Seznam.cz
            if (customerEmail) {
              console.log('📧 Sending license confirmation email via Seznam.cz to:', customerEmail)
              try {
                await sendLicenseConfirmationEmail({
                  email: customerEmail,
                  licensesCount: newLicensesCount,
                  downloadUrl: process.env.DOWNLOAD_URL!,
                  sessionId: session.id,
                  isFirstLicense: user.licenseType === 'NONE'
                })
                console.log('✅ Confirmation email sent successfully via Seznam.cz')
              } catch (emailError) {
                console.error('❌ Failed to send confirmation email:', emailError)
                // Nepřerušuj webhook i když email selže
              }
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

// Function to send license confirmation email via Seznam.cz with receipt
async function sendLicenseConfirmationEmail(data: {
  email: string
  licensesCount: number
  downloadUrl: string
  sessionId: string
  isFirstLicense: boolean
}) {
  const { email, licensesCount, downloadUrl, sessionId, isFirstLicense } = data
  
  const licenseText = isFirstLicense 
    ? 'Your first license has been successfully activated!' 
    : `You've added another license! You now have ${licensesCount} licenses total.`
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>WallMotion - Thank You for Your Purchase!</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc;
          line-height: 1.6;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: white;
          border-radius: 12px;
          margin-top: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding: 30px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }
        .logo { 
          font-size: 48px; 
          margin-bottom: 10px; 
        }
        .download-btn { 
          display: inline-block; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 16px 32px; 
          text-decoration: none; 
          border-radius: 12px; 
          font-weight: bold; 
          margin: 20px 0;
          font-size: 18px;
        }
        .download-btn:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }
        .receipt { 
          background: #f8fafc; 
          border: 2px solid #e2e8f0;
          border-radius: 12px; 
          padding: 24px; 
          margin: 24px 0;
        }
        .receipt-header {
          text-align: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .receipt-row.total {
          border-bottom: none;
          border-top: 2px solid #e2e8f0;
          margin-top: 12px;
          padding-top: 16px;
          font-weight: bold;
          font-size: 18px;
        }
        .instructions { 
          background: #f0f9ff; 
          padding: 20px; 
          border-radius: 12px; 
          margin: 20px 0;
          border-left: 4px solid #0ea5e9;
        }
        .footer { 
          text-align: center; 
          color: #64748b; 
          font-size: 14px; 
          margin-top: 40px; 
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .license-info {
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
        }
        .features-box {
          background: #eff6ff;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
        }
        .support-box {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🖥️</div>
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Purchase!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your payment has been processed successfully</p>
        </div>
        
        <p>Hello! 👋</p>
        
        <p>Your payment was successful and WallMotion is ready to download. You can now start creating amazing animated wallpapers on your Mac!</p>
        
        <!-- RECEIPT SECTION -->
        <div class="receipt">
          <div class="receipt-header">
            <h2 style="margin: 0; color: #1e293b;">📄 Purchase Receipt</h2>
            <p style="margin: 5px 0 0 0; color: #64748b;">Transaction ID: ${sessionId}</p>
          </div>
          
          <div class="receipt-row">
            <span style="color: #64748b;">Date:</span>
            <span style="font-weight: 500;">${currentDate}</span>
          </div>
          
          <div class="receipt-row">
            <span style="color: #64748b;">Customer Email:</span>
            <span style="font-weight: 500;">${email}</span>
          </div>
          
          <div class="receipt-row">
            <span style="color: #64748b;">Product:</span>
            <span style="font-weight: 500;">WallMotion License (1 Device)</span>
          </div>
          
          <div class="receipt-row">
            <span style="color: #64748b;">License Type:</span>
            <span style="font-weight: 500;">Lifetime License</span>
          </div>
          
          <div class="receipt-row">
            <span style="color: #64748b;">Quantity:</span>
            <span style="font-weight: 500;">1</span>
          </div>
          
          <div class="receipt-row">
            <span style="color: #64748b;">Unit Price:</span>
            <span style="font-weight: 500;">$15.00 USD</span>
          </div>
          
          <div class="receipt-row total">
            <span style="color: #1e293b;">Total Paid:</span>
            <span style="color: #059669; font-size: 20px;">$15.00 USD</span>
          </div>
          
          <div style="text-align: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #059669; font-weight: 500;">✅ Payment Status: COMPLETED</p>
          </div>
        </div>
        
        <div class="license-info">
          <h3 style="margin: 0 0 10px 0; color: #059669;">✅ ${licenseText}</h3>
          <p style="margin: 0; color: #047857;">
            Total Licenses: <strong>${licensesCount}</strong><br>
            License Type: <strong>Lifetime License</strong><br>
            Valid for: <strong>1 macOS Device</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" class="download-btn">
            📥 Download WallMotion for macOS
          </a>
        </div>
        
        <div class="instructions">
          <h3 style="margin-top: 0; color: #0369a1;">🔧 Installation Instructions:</h3>
          <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Click the download button above to get the application</li>
            <li>Open the downloaded .dmg file from your Downloads folder</li>
            <li>Drag WallMotion.app to your Applications folder</li>
            <li>Launch the app from Launchpad or Applications</li>
            <li>On first launch, click "Open" in the security dialog</li>
            <li>Sign in with your account: <strong>${email}</strong></li>
            <li>Start creating amazing animated wallpapers!</li>
          </ol>
        </div>
        
        ${licensesCount > 1 ? `
        <div class="support-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">📱 Multiple Devices:</h4>
          <p style="margin: 0; color: #92400e;">
            You have ${licensesCount} licenses, which means you can use WallMotion on ${licensesCount} different Mac computers. 
            Each device will automatically register when you first sign in.
          </p>
        </div>
        ` : `
        <div class="support-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">💡 Need More Devices?</h4>
          <p style="margin: 0; color: #92400e;">
            This license is valid for one Mac. If you need WallMotion on additional computers, 
            you can purchase additional licenses from your user profile.
          </p>
        </div>
        `}
        
        <div class="features-box">
          <h4 style="margin: 0 0 10px 0; color: #1e40af;">🎯 What You Can Do with WallMotion:</h4>
          <ul style="margin: 0; color: #1e40af; line-height: 1.8; padding-left: 20px;">
            <li>Upload unlimited videos</li>
            <li>Create animated wallpapers from MP4, MOV, and other formats</li>
            <li>Automatic backup of your wallpapers</li>
            <li>Native macOS integration</li>
            <li>Lifetime updates included</li>
            <li>Smart wallpaper replacement</li>
            <li>High-quality video processing</li>
          </ul>
        </div>
        
        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">📞 Need Help?</h4>
          <p style="margin: 0; color: #4b5563;">
            If you have any questions or need support, don't hesitate to contact us at 
            <strong>${process.env.SEZNAM_EMAIL_USER}</strong>. We're here to help!
          </p>
        </div>
        
        <p>Enjoy creating stunning animated wallpapers!</p>
        
        <p>Best regards,<br><strong>The WallMotion Team</strong></p>
        
        <div class="footer">
          <p>This email was sent automatically after your successful WallMotion license purchase.</p>
          <p><strong>WallMotion © 2025</strong> - Animated Wallpapers for macOS</p>
          <p>If you did not make this purchase, please contact us immediately.</p>
          <p style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            Keep this email as your receipt for tax and warranty purposes.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
WallMotion - Thank You for Your Purchase!

Hello!

Your payment was successful and WallMotion is ready to download.

PURCHASE RECEIPT
================
Transaction ID: ${sessionId}
Date: ${currentDate}
Customer Email: ${email}
Product: WallMotion License (1 Device)
License Type: Lifetime License
Quantity: 1
Unit Price: $15.00 USD
Total Paid: $15.00 USD
Payment Status: COMPLETED

${licenseText}

License Information:
- Total Licenses: ${licensesCount}
- License Type: Lifetime License
- Valid for: 1 macOS Device

Download WallMotion: ${downloadUrl}

Installation Instructions:
1. Download the app from the link above
2. Open the .dmg file
3. Drag WallMotion to Applications
4. Launch and sign in with your account: ${email}
5. Start creating animated wallpapers!

What You Can Do with WallMotion:
- Upload unlimited videos
- Create animated wallpapers from MP4, MOV formats
- Automatic backup
- Native macOS integration
- Lifetime updates included
- Smart wallpaper replacement

Support: ${process.env.SEZNAM_EMAIL_USER}

Best regards,
The WallMotion Team

---
WallMotion © 2025 - Animated Wallpapers for macOS

Keep this email as your receipt for tax and warranty purposes.
  `

  const mailOptions = {
    from: {
      name: 'WallMotion',
      address: process.env.SEZNAM_EMAIL_USER!
    },
    to: email,
    subject: '🎉 WallMotion License Activated - Download Your App + Receipt',
    text: textContent,
    html: htmlContent,
  }

  await transporter.sendMail(mailOptions)
}