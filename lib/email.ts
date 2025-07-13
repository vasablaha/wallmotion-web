// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail', // nebo jiný email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password pro Gmail
  },
})

interface SendDownloadEmailParams {
  email: string
  sessionId: string
  downloadUrl: string
}

export async function sendDownloadEmail({ 
  email, 
  sessionId, 
  downloadUrl 
}: SendDownloadEmailParams) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>WallMotion - Download Your App</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .download-btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; margin: 20px 0; }
        .instructions { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <span style="color: white; font-size: 40px;">🖥️</span>
          </div>
          <h1 style="color: #1e293b;">Thank you for purchasing WallMotion!</h1>
        </div>
        
        <p>Hi there! 👋</p>
        
        <p>Your payment was successful and WallMotion is ready to download. Click the button below to get your app:</p>
        
        <div style="text-align: center;">
          <a href="${downloadUrl}" class="download-btn">Download WallMotion</a>
        </div>
        
        <div class="instructions">
          <h3>📋 Installation Instructions:</h3>
          <ol>
            <li>Download the WallMotion.dmg file</li>
            <li>Double-click to open the disk image</li>
            <li>Drag WallMotion.app to your Applications folder</li>
            <li>Right-click WallMotion and select "Open" (first time only)</li>
            <li>Click "Open" in the security dialog</li>
          </ol>
          
          <h3>🚀 Getting Started:</h3>
          <ul>
            <li>Set a video wallpaper in System Settings first</li>
            <li>Open WallMotion and upload your MP4/MOV videos</li>
            <li>Click "Replace Wallpaper" and enjoy!</li>
          </ul>
        </div>
        
        <p><strong>Need help?</strong> Reply to this email and we&apos;ll get back to you quickly!</p>
        
        <p>Enjoy your new live wallpapers! 🎉</p>
        
        <p>Best regards,<br>
        The WallMotion Team</p>
        
        <div class="footer">
          <p>Transaction ID: ${sessionId}</p>
          <p>This download link is valid for 30 days.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🎉 WallMotion - Download Your App Now!',
    html: htmlContent,
  })
}