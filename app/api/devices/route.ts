import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Device from '@/lib/models/Device'
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
    
    // Vrátit pouze aktivní a neodstraněná zařízení
    const devices = await Device.find({ 
      cognitoId: auth.cognitoId,
      isActive: true,
      isRemoved: false
    })
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
    if (auth.user.licenseType === 'NONE' || (auth.user.licensesCount || 0) === 0) {
      return NextResponse.json({ error: 'Nemáte platnou licenci' }, { status: 403 })
    }
    
    const { fingerprint, name, macModel, macosVersion, appVersion } = await req.json()
    
    if (!fingerprint || !name) {
      return NextResponse.json({ 
        error: 'Fingerprint a název zařízení jsou povinné' 
      }, { status: 400 })
    }
    
    // Najít existující zařízení podle fingerprints
    const existingDevice = await Device.findOne({ fingerprint })
    
    if (existingDevice) {
      // Pokud bylo zařízení odebráno, musí koupit novou licenci
      if (existingDevice.isRemoved) {
        return NextResponse.json({ 
          error: 'Toto zařízení bylo odebráno z účtu. Pro opětovné použití je potřeba zakoupit novou licenci.' 
        }, { status: 403 })
      }
      
      // Pokud je zařízení registrované pro jiného uživatele
      if (existingDevice.cognitoId !== auth.cognitoId) {
        return NextResponse.json({ 
          error: 'Toto zařízení je již registrované u jiného uživatele' 
        }, { status: 409 })
      }
      
      // Zařízení patří stejnému uživateli - jen se znovu přihlašuje
      const updatedDevice = await Device.findByIdAndUpdate(
        existingDevice._id,
        {
          name,
          macModel,
          macosVersion,
          appVersion,
          isLoggedIn: true,  // Označit jako přihlášené
          lastSeen: new Date()
        },
        { new: true }
      )
      
      console.log(`Device logged in: ${fingerprint} for user: ${auth.cognitoId}`)
      return NextResponse.json({ success: true, device: JSON.parse(JSON.stringify(updatedDevice.toObject())) })
    }
    
    // Kontrola limitu aktivních zařízení (pouze isActive=true a isRemoved=false)
    const activeDevicesCount = await Device.countDocuments({
      cognitoId: auth.cognitoId,
      isActive: true,
      isRemoved: false
    })
    
    const maxDevices = auth.user.licensesCount || 0
    
    if (activeDevicesCount >= maxDevices) {
      return NextResponse.json({ 
        error: `Můžete mít registrováno maximálně ${maxDevices} ${maxDevices === 1 ? 'zařízení' : 'zařízení'}. Kupte další licenci nebo odeberte stávající zařízení.`
      }, { status: 400 })
    }
    
    // Registrace nového zařízení
    const device = new Device({
      fingerprint,
      name,
      macModel,
      macosVersion,
      appVersion,
      cognitoId: auth.cognitoId,
      isActive: true,
      isLoggedIn: true,
      isRemoved: false
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
    
    const { fingerprint, action } = await req.json()
    
    if (!fingerprint) {
      return NextResponse.json({ 
        error: 'Fingerprint je povinný' 
      }, { status: 400 })
    }
    
    const device = await Device.findOne({ 
      fingerprint, 
      cognitoId: auth.cognitoId,
      isRemoved: false  // Pouze neodstraněná zařízení
    })
    
    if (!device) {
      return NextResponse.json({ 
        error: 'Zařízení nebylo nalezeno' 
      }, { status: 404 })
    }
    
    if (action === 'logout') {
      // Označit jako odhlášené (ale stále aktivní)
      await Device.findByIdAndUpdate(device._id, {
        isLoggedIn: false,
        lastSeen: new Date()
      })
      
      console.log(`Device logged out: ${fingerprint} for user: ${auth.cognitoId}`)
      return NextResponse.json({ 
        success: true, 
        message: 'Zařízení bylo odhlášeno' 
      })
    }
    
    return NextResponse.json({ 
      error: 'Neplatná akce' 
    }, { status: 400 })
    
  } catch (error) {
    console.error('Device logout error:', error)
    return NextResponse.json({ 
      error: 'Nepodařilo se odhlásit zařízení' 
    }, { status: 500 })
  }
}

// DELETE /api/devices?id=deviceId - Odebrání zařízení (z webu)
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
    
    const device = await Device.findById(deviceId)
    
    if (!device) {
      return NextResponse.json({ error: 'Zařízení nebylo nalezeno' }, { status: 404 })
    }
    
    if (device.cognitoId !== auth.cognitoId) {
      return NextResponse.json({ error: 'Nemáte oprávnění smazat toto zařízení' }, { status: 403 })
    }
    
    // Označit jako odstraněné (zachovat fingerprint pro blokování)
    await Device.findByIdAndUpdate(deviceId, {
      isActive: false,
      isLoggedIn: false,
      isRemoved: true,
      removedAt: new Date()
    })
    
    console.log(`Device removed (blocked): ${device.name} (${deviceId}) by user ${auth.cognitoId}`)
    
    return NextResponse.json({ 
      message: 'Zařízení bylo úspěšně odebráno',
      deviceName: device.name
    })
    
  } catch (error) {
    console.error('Delete device error:', error)
    return NextResponse.json({ error: 'Nepodařilo se odebrat zařízení' }, { status: 500 })
  }
}
