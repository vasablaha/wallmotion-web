import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'
import { generateSecretHash, getClientSecret, getClientId } from './cognito-helpers'

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION_AWS!
})

export class DirectCognitoAuth {
  static async signUp(email: string, password: string) {
    try {
      const clientId = getClientId()
      const clientSecret = getClientSecret()
      const secretHash = generateSecretHash(email.toLowerCase().trim(), clientId, clientSecret)
      
      const command = new SignUpCommand({
        ClientId: clientId,
        Username: email.toLowerCase().trim(),
        Password: password,
        SecretHash: secretHash,
        UserAttributes: [
          {
            Name: 'email',
            Value: email.toLowerCase().trim()
          }
        ]
      })
      
      console.log('🔑 Using direct Cognito SDK with SECRET_HASH')
      const result = await cognitoClient.send(command)
      console.log('✅ Direct signup success:', result)
      
      return {
        user: result.UserSub,
        userConfirmed: result.UserConfirmed
      }
    } catch (error: unknown) {
      console.error('❌ Direct signup error:', error)
      throw error
    }
  }
  
  static async confirmSignUp(email: string, confirmationCode: string) {
    try {
      const clientId = getClientId()
      const clientSecret = getClientSecret()
      const secretHash = generateSecretHash(email.toLowerCase().trim(), clientId, clientSecret)
      
      const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: email.toLowerCase().trim(),
        ConfirmationCode: confirmationCode,
        SecretHash: secretHash
      })
      
      const result = await cognitoClient.send(command)
      console.log('✅ Direct confirm success:', result)
      
      return result
    } catch (error: unknown) {
      console.error('❌ Direct confirm error:', error)
      throw error
    }
  }
  
  static async signIn(email: string, password: string) {
    try {
      const clientId = getClientId()
      const clientSecret = getClientSecret()
      const secretHash = generateSecretHash(email.toLowerCase().trim(), clientId, clientSecret)
      
      const command = new InitiateAuthCommand({
        ClientId: clientId,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email.toLowerCase().trim(),
          PASSWORD: password,
          SECRET_HASH: secretHash
        }
      })
      
      const result = await cognitoClient.send(command)
      console.log('✅ Direct signin success:', result)
      
      return {
        accessToken: result.AuthenticationResult?.AccessToken,
        idToken: result.AuthenticationResult?.IdToken,
        refreshToken: result.AuthenticationResult?.RefreshToken
      }
    } catch (error: unknown) {
      console.error('❌ Direct signin error:', error)
      throw error
    }
  }
  
  static async resendConfirmationCode(email: string) {
    try {
      const clientId = getClientId()
      const clientSecret = getClientSecret()
      const secretHash = generateSecretHash(email.toLowerCase().trim(), clientId, clientSecret)
      
      const command = new ResendConfirmationCodeCommand({
        ClientId: clientId,
        Username: email.toLowerCase().trim(),
        SecretHash: secretHash
      })
      
      const result = await cognitoClient.send(command)
      console.log('✅ Direct resend success:', result)
      
      return result
    } catch (error: unknown) {
      console.error('❌ Direct resend error:', error)
      throw error
    }
  }
}