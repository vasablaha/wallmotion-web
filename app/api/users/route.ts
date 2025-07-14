import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'
import { validateCognitoToken } from '@/lib/auth-cognito'

// GET /api/user - Získání informací o aktuálním uživateli
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await User.findOne({ cognitoId: auth.cognitoId })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Convert to plain object and remove sensitive data
    const userObj = JSON.parse(JSON.stringify(user.toObject()))
    delete userObj.stripeCustomerId
    
    return NextResponse.json({ 
      user: userObj 
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Nepodařilo se načíst data uživatele' }, { status: 500 })
  }
}

// PUT /api/user - Aktualizace informací o uživateli
export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    
    const auth = await validateCognitoToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email je povinný' }, { status: 400 })
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { cognitoId: auth.cognitoId },
      { email: email.toLowerCase().trim() },
      { new: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Convert to plain object and remove sensitive data
    const userObj = JSON.parse(JSON.stringify(updatedUser.toObject()))
    delete userObj.stripeCustomerId
    
    return NextResponse.json({ 
      user: userObj,
      message: 'Údaje byly úspěšně aktualizovány'
    })
    
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Nepodařilo se aktualizovat údaje' }, { status: 500 })
  }
}