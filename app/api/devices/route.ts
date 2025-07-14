import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Device from '@/lib/models/Device'
import { validateCognitoToken } from '@/lib/auth-cognito'

// GET /api/devices - Seznam zařízení uživatele
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const devices = await Device.find({ cognitoId: auth.cognitoId })
      .sort({ lastSeen: -1 })
      .lean()
    
    return NextResponse.json({ devices })
    
  } catch (error) {
    console.error('Get devices error:', error)
    return NextResponse.json({ error: 'Nepodařilo se načíst zařízení' }, { status: 500 })
  }
}

// POST /api/devices - Registrace nového zařízení
export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Kontrola licence
    if (auth.user.licenseType === 'NONE') {
      return NextResponse.json({ error: 'Nemáte platnou licenci' }, { status: 403 })
    }
    
    const { fingerprint, name, macModel, macosVersion, appVersion } = await req.json()
    
    // Validace required fields
    if (!fingerprint || !name) {
      return NextResponse.json({ 
        error: 'Fingerprint a název zařízení jsou povinné' 
      }, { status: 400 })
    }
    
    // Kontrola limit zařízení (1 aktivní zařízení na uživatele)
    const existingDevices = await Device.countDocuments({
      cognitoId: auth.cognitoId,
      isActive: true 
    })
    
    if (existingDevices >= 1) {
      return NextResponse.json({ 
        error: 'Můžete mít registrované pouze jedno zařízení. Odeberte stávající zařízení pro registraci nového.' 
      }, { status: 400 })
    }
    
    // Kontrola duplicitního fingerprints
    const existingFingerprint = await Device.findOne({ fingerprint })
    
    if (existingFingerprint && existingFingerprint.isActive) {
      return NextResponse.json({ 
        error: 'Toto zařízení je již registrované u jiného uživatele' 
      }, { status: 409 })
    }
    
    // Pokud existuje neaktivní zařízení se stejným fingerprint, reaktivuj ho
    if (existingFingerprint && !existingFingerprint.isActive) {
      const updatedDevice = await Device.findByIdAndUpdate(
        existingFingerprint._id,
        {
          cognitoId: auth.cognitoId,
          name,
          macModel,
          macosVersion,
          appVersion,
          isActive: true,
          lastSeen: new Date()
        },
        { new: true }
      )
      
      console.log(`Device reactivated: ${fingerprint} for user: ${auth.cognitoId}`)
      return NextResponse.json({ success: true, device: updatedDevice })
    }
    
    // Registrace nového zařízení
    const device = new Device({
      fingerprint,
      name,
      macModel,
      macosVersion,
      appVersion,
      cognitoId: auth.cognitoId
    })
    
    await device.save()
    
    console.log(`New device registered: ${fingerprint} for user: ${auth.cognitoId}`)
    return NextResponse.json({ success: true, device })
    
  } catch (error) {
    console.error('Device registration error:', error)
    return NextResponse.json({ error: 'Nepodařilo se registrovat zařízení' }, { status: 500 })
  }
}

// DELETE /api/devices - Deaktivace zařízení
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { deviceId } = await req.json()
    
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID je povinné' }, { status: 400 })
    }
    
    // Deaktivace zařízení (pouze vlastní zařízení)
    const result = await Device.updateOne(
      { 
        _id: deviceId,
        cognitoId: auth.cognitoId 
      },
      { isActive: false }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Zařízení nenalezeno' }, { status: 404 })
    }
    
    console.log(`Device deactivated: ${deviceId} by user: ${auth.cognitoId}`)
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Delete device error:', error)
    return NextResponse.json({ error: 'Nepodařilo se odebrat zařízení' }, { status: 500 })
  }
}