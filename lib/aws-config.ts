import { Amplify } from 'aws-amplify'

const awsConfig = {
  Auth: {
    Cognito: {
      region: process.env.REGION_AWS!,
      userPoolId: process.env.USER_POOL_ID_AWS!,
      userPoolClientId: process.env.USER_POOL_CLIENT_ID_AWS!,
      loginWith: {
        email: true
      }
    }
  }
}

// Initialize Amplify
Amplify.configure(awsConfig)

export default awsConfig