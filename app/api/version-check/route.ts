// app/api/version-check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Version, { IVersion } from '../../../lib/models/Versions'

// GET /api/version-check - Vrátí nejnovější verzi z databáze
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(req.url)
    const currentVersion = searchParams.get('current_version')
    const bundleId = searchParams.get('bundle_id') || 'tapp-studio.WallMotion'
    
    // Najít nejnovější aktivní verzi
    const latestVersion = await Version.findOne({
      bundleId,
      channel: 'stable',
      isActive: true,
      isPrerelease: false
    }).sort({ releaseDate: -1 }).lean() as IVersion | null
    
    if (!latestVersion) {
      return NextResponse.json({ 
        error: 'No version found',
        hasUpdate: false
      }, { status: 404 })
    }
    
    // Porovnání verzí
    let hasUpdate = false
    if (currentVersion) {
      hasUpdate = isNewerVersion(latestVersion.version, currentVersion)
    } else {
      hasUpdate = true
    }
    
    return NextResponse.json({
      hasUpdate,
      currentVersion,
      latest: {
        version: latestVersion.version,
        downloadUrl: latestVersion.downloadUrl,
        releaseNotes: latestVersion.releaseNotes,
        forceUpdate: latestVersion.forceUpdate
      }
    })
    
  } catch (error) {
    console.error('Version check error:', error)
    return NextResponse.json({ 
      error: 'Version check failed',
      hasUpdate: false
    }, { status: 500 })
  }
}

// Pomocná funkce pro porovnání verzí
function isNewerVersion(latest: string, current: string): boolean {
  const latestParts = latest.split('.').map(Number)
  const currentParts = current.split('.').map(Number)
  
  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const latestPart = latestParts[i] || 0
    const currentPart = currentParts[i] || 0
    
    if (latestPart > currentPart) return true
    if (latestPart < currentPart) return false
  }
  
  return false
}