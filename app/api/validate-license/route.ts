import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Device from '@/lib/models/Device'
import User from '@/lib/models/User'

// POST /api/validate-license - Validace licence pro macOS aplikaci
export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    const { fingerprint, bundleId, version } = await req.json()
    
    // Validace required fields
    if (!fingerprint) {
      return NextResponse.json({ 
        valid: false, 
        reason: 'Missing device fingerprint' 
      })
    }
    
    // Validace bundle ID pro security
    if (bundleId !== 'tapp-studio.WallMotion') {
      return NextResponse.json({ 
        valid: false, 
        reason: 'Invalid application bundle ID' 
      })
    }
    
    // Najít zařízení podle fingerprints
    const device = await Device.findOne({ fingerprint })
    
    if (!device) {
      return NextResponse.json({ 
        valid: false, 
        reason: 'Device not registered' 
      })
    }
    
    if (!device.isActive) {
      return NextResponse.json({ 
        valid: false, 
        reason: 'Device is inactive' 
      })
    }
    
    // Najít uživatele podle cognitoId
    const user = await User.findOne({ cognitoId: device.cognitoId })
    
    if (!user) {
      return NextResponse.json({ 
        valid: false, 
        reason: 'User not found' 
      })
    }
    
    if (user.licenseType === 'NONE') {
      return NextResponse.json({ 
        valid: false, 
        reason: 'No valid license' 
      })
    }
    
    // Update last seen a app version
    await Device.updateOne(
      { _id: device._id },
      { 
        lastSeen: new Date(),
        ...(version && { appVersion: version })
      }
    )
    
    // Return license info
    return NextResponse.json({ 
      valid: true,
      license: {
        type: user.licenseType,
        purchaseDate: user.purchaseDate,
        features: ['video_wallpapers', 'unlimited_imports'],
        deviceInfo: {
          name: device.name,
          registeredAt: device.registeredAt
        }
      }
    })
    
  } catch (error) {
    console.error('License validation error:', error)
    return NextResponse.json({ 
      valid: false, 
      reason: 'Validation error' 
    })
  }
}

// GET /api/validate-license - Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'License validation API is running',
    version: '1.0.0'
  })
}