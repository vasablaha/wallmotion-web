import { Amplify } from 'aws-amplify'

const awsConfig = {
  Auth: {
    Cognito: {
      region: process.env.REGION_AWS || 'eu-central-1',
      userPoolId: process.env.USER_POOL_ID_AWS || 'eu-central-1_XlJRxXSVU',
      userPoolClientId: process.env.USER_POOL_CLIENT_ID_AWS || '21k9gm2tk1e3f3na8u7r5cs9fe',
      // Client secret for debugging (but SECRET_HASH is generated per-request)
      userPoolClientSecret: process.env.USER_POOL_CLIENT_SECRET_AWS,
      loginWith: {
        email: true
      }
    }
  }
}

// Initialize Amplify synchronously
Amplify.configure(awsConfig)

// Export initialization promise for components to wait for
export const amplifyReady = Promise.resolve(true)

export default awsConfig