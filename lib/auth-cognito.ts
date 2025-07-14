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

    let accessToken = authHeader.replace('Bearer ', '')

    // Pokud token vypadá jako JSON z localStorage, parsuj ho
    if (accessToken.startsWith('{')) {
      try {
        const storedAuthData = JSON.parse(accessToken)
        accessToken = storedAuthData.accessToken
        
        // Kontrola stáří tokenů z localStorage
        const loginTime = storedAuthData.loginTime || 0
        const hoursSinceLogin = (Date.now() - loginTime) / (1000 * 60 * 60)
        
        if (hoursSinceLogin > 1) { // Tokeny jsou starší než 1 hodina
          console.log('🕐 Token is older than 1 hour, rejecting')
          return null
        }
      } catch  {
        console.log('Failed to parse token JSON, using as-is')
      }
    }

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
    const emailAttribute = cognitoUser.UserAttributes.find(attr => attr.Name === 'email')
    
    if (!emailAttribute || !emailAttribute.Value) {
      return null
    }
    
    const email = emailAttribute.Value

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
        licenseType: 'NONE',
        licensesCount: 0
      })
      await user.save()
    }

    return {
      cognitoId,
      email,
      user: user.toObject()
    }

} catch (error: unknown) {
  // Type guard pro error handling
  const isAwsError = (err: unknown): err is { name: string; message: string } => {
    return typeof err === 'object' && err !== null && 'name' in err && 'message' in err
  }

  // Pokud je token expirovaný, jednoduše vrať null
  if (isAwsError(error) && error.name === 'NotAuthorizedException') {
    console.log('🕐 Token expired or invalid, user needs to login again')
    return null
  }
  
  console.error('Cognito token validation error:', error)
  return null
}
}