import * as crypto from 'crypto'

/**
 * Generate SECRET_HASH for Cognito client with secret
 * Required when app client has "Generate a client secret" enabled
 */
export function generateSecretHash(username: string, clientId: string, clientSecret: string): string {
  const message = username + clientId
  const hmac = crypto.createHmac('SHA256', clientSecret)
  hmac.update(message)
  return hmac.digest('base64')
}

/**
 * Get client secret from environment
 */
export function getClientSecret(): string {
  const secret = process.env.USER_POOL_CLIENT_SECRET_AWS
  if (!secret) {
    throw new Error('USER_POOL_CLIENT_SECRET_AWS environment variable is required')
  }
  return secret
}

/**
 * Get client ID from environment
 */
export function getClientId(): string {
  const clientId = process.env.USER_POOL_CLIENT_ID_AWS
  if (!clientId) {
    throw new Error('USER_POOL_CLIENT_ID_AWS environment variable is required')
  }
  return clientId
}