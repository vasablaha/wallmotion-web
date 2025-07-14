import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Device, { IDevice } from '@/lib/models/Device'
import { validateCognitoToken } from '@/lib/auth-cognito'

// GET /api/devices - Seznam zařízení nebo detail konkrétního zařízení
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const deviceId = searchParams.get('id')
    
    // Pokud je zadané ID, vrať detail konkrétního zařízení
    if (deviceId) {
      const device = await Device.findById(deviceId)
      
      if (!device) {
        return NextResponse.json({ error: 'Zařízení nebylo nalezeno' }, { status: 404 })
      }
      
      if (device.cognitoId !== auth.cognitoId) {
        return NextResponse.json({ error: 'Nemáte oprávnění zobrazit toto zařízení' }, { status: 403 })
      }
      
      return NextResponse.json({ device: JSON.parse(JSON.stringify(device.toObject())) })
    }
    
    // Jinak vrať seznam všech zařízení uživatele
    const devices = await Device.find({ cognitoId: auth.cognitoId })
      .sort({ lastSeen: -1 })
      .lean()
    
    return NextResponse.json({ devices })
    
  } catch (error) {
    console.error('Get devices error:', error)
    return NextResponse.json({ error: 'Nepodařilo se načíst zařízení' }, { status: 500 })
  }
}

// POST /api/devices - Registrace nového zařízení (volané z macOS aplikace)
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
      return NextResponse.json({ success: true, device: JSON.parse(JSON.stringify(updatedDevice.toObject())) })
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
    return NextResponse.json({ success: true, device: JSON.parse(JSON.stringify(device.toObject())) })
    
  } catch (error) {
    console.error('Device registration error:', error)
    return NextResponse.json({ error: 'Nepodařilo se registrovat zařízení' }, { status: 500 })
  }
}

// PUT /api/devices?id=deviceId - Přejmenování zařízení (volané z Dashboard)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const deviceId = searchParams.get('id')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'ID zařízení je povinné' }, { status: 400 })
    }
    
    const { name } = await req.json()
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Název zařízení je povinný' }, { status: 400 })
    }
    
    // Najít zařízení a ověřit vlastnictví
    const device = await Device.findById(deviceId)
    
    if (!device) {
      return NextResponse.json({ error: 'Zařízení nebylo nalezeno' }, { status: 404 })
    }
    
    if (device.cognitoId !== auth.cognitoId) {
      return NextResponse.json({ error: 'Nemáte oprávnění upravit toto zařízení' }, { status: 403 })
    }
    
    // Aktualizovat název
    device.name = name.trim()
    await device.save()
    
    console.log(`Device ${deviceId} renamed to "${name}" by user ${auth.cognitoId}`)
    
    return NextResponse.json({ 
      message: 'Název zařízení byl úspěšně změněn',
      device: JSON.parse(JSON.stringify(device.toObject()))
    })
    
  } catch (error) {
    console.error('Update device error:', error)
    return NextResponse.json({ error: 'Nepodařilo se aktualizovat zařízení' }, { status: 500 })
  }
}

// DELETE /api/devices?id=deviceId - Smazání zařízení (volané z Dashboard)
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const deviceId = searchParams.get('id')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'ID zařízení je povinné' }, { status: 400 })
    }
    
    // Najít zařízení a ověřit vlastnictví
    const device = await Device.findById(deviceId)
    
    if (!device) {
      return NextResponse.json({ error: 'Zařízení nebylo nalezeno' }, { status: 404 })
    }
    
    if (device.cognitoId !== auth.cognitoId) {
      return NextResponse.json({ error: 'Nemáte oprávnění smazat toto zařízení' }, { status: 403 })
    }
    
    // Smazat zařízení
    await Device.findByIdAndDelete(deviceId)
    
    console.log(`Device ${device.name} (${deviceId}) deleted by user ${auth.cognitoId}`)
    
    return NextResponse.json({ 
      message: 'Zařízení bylo úspěšně odebráno',
      deviceName: device.name
    })
    
  } catch (error) {
    console.error('Delete device error:', error)
    return NextResponse.json({ error: 'Nepodařilo se odebrat zařízení' }, { status: 500 })
  }
}