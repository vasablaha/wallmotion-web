import { NextRequest } from 'next/server'
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import dbConnect from './mongodb'
import User from './models/User'

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION_AWS!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS!
  }
})

export async function validateCognitoToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const accessToken = authHeader.replace('Bearer ', '')

    // Ověření tokenu přes Cognito
    const getUserCommand = new GetUserCommand({
      AccessToken: accessToken
    })

    const cognitoUser = await cognitoClient.send(getUserCommand)
    
    if (!cognitoUser.UserAttributes) {
      return null
    }

    // Extrakce user informací
    const cognitoId = cognitoUser.Username!
    const email = cognitoUser.UserAttributes.find(attr => attr.Name === 'email')?.Value!

    // Připojit k databázi
    await dbConnect()
    
    // Najít nebo vytvořit uživatele v naší DB
    let user = await User.findOne({ cognitoId })

    if (!user) {
      // Auto-vytvoření uživatele při prvním přihlášení
      console.log(`Creating new user for Cognito ID: ${cognitoId}`)
      user = new User({
        cognitoId,
        email,
        licenseType: 'NONE'
      })
      await user.save()
    }

    return {
      cognitoId,
      email,
      user: user.toObject()
    }

  } catch (error) {
    console.error('Cognito token validation error:', error)
    return null
  }
}