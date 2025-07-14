'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { amplifyReady } from '@/lib/aws-config'
import { DirectCognitoAuth } from '@/lib/cognito-direct'

interface AuthContextType {
  user: any | null
  loading: boolean
  amplifyReady: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  confirmSignUp: (email: string, code: string) => Promise<any>
  resendConfirmationCode: (email: string) => Promise<any>
  getAccessToken: () => Promise<string | null>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAmplifyReady, setIsAmplifyReady] = useState(false)

  useEffect(() => {
    // Wait for Amplify to be configured
    const initializeAuth = async () => {
      try {
        // Wait for Amplify config
        await amplifyReady
        
        // Additional delay to ensure full initialization
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setIsAmplifyReady(true)
        console.log('🚀 Amplify ready, checking user...')
        
        await checkUser()
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsAmplifyReady(true)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const checkUser = async () => {
    if (!isAmplifyReady) return
    
    try {
      const currentUser = await getCurrentUser()
      console.log('✅ Current user found:', currentUser.username)
      setUser(currentUser)
    } catch (error) {
      console.log('ℹ️ No authenticated user found')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    if (!isAmplifyReady) {
      throw new Error('Authentication system not ready')
    }

    try {
      setLoading(true)
      console.log('🔐 Attempting DIRECT Cognito sign in for:', email)
      
      const result = await DirectCognitoAuth.signIn(email, password)
      
      console.log('✅ Direct sign in result:', result)
      
      // TODO: Set user state from tokens
      // For now, we'll need to implement token-based user management
      
      return result
    } catch (error: any) {
      console.error('❌ Direct sign in error:', error)
      
      switch (error.name) {
        case 'NotAuthorizedException':
          throw new Error('Neplatný email nebo heslo')
        case 'UserNotConfirmedException':
          throw new Error('Účet není ověřen. Zkontrolujte email pro ověřovací kód.')
        case 'UserNotFoundException':
          throw new Error('Uživatel s tímto emailem neexistuje')
        case 'PasswordResetRequiredException':
          throw new Error('Je potřeba resetovat heslo')
        case 'TooManyRequestsException':
          throw new Error('Příliš mnoho pokusů. Zkuste to později.')
        default:
          throw new Error(error.message || 'Přihlášení se nezdařilo')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (email: string, password: string) => {
    if (!isAmplifyReady) {
      throw new Error('Authentication system not ready')
    }

    try {
      setLoading(true)
      console.log('📝 Attempting sign up for:', email)
      
      const clientId = process.env.USER_POOL_CLIENT_ID_AWS!
      const clientSecret = getClientSecret()
      const secretHash = generateSecretHash(email.toLowerCase().trim(), clientId, clientSecret)
      
      console.log('🔑 SECRET_HASH generated for signup')
      
      const result = await signUp({
        username: email.toLowerCase().trim(),
        password,
        options: {
          userAttributes: {
            email: email.toLowerCase().trim()
          }
        }
      })
      
      console.log('✅ Sign up result:', result)
      return result
    } catch (error: any) {
      console.error('❌ Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      console.log('✅ User signed out')
      setUser(null)
    } catch (error: any) {
      console.error('❌ Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSignUp = async (email: string, code: string) => {
    if (!isAmplifyReady) {
      throw new Error('Authentication system not ready')
    }

    try {
      setLoading(true)
      
      const clientId = process.env.USER_POOL_CLIENT_ID_AWS!
      const clientSecret = getClientSecret()
      const secretHash = generateSecretHash(email.toLowerCase().trim(), clientId, clientSecret)
      
      const result = await confirmSignUp({
        username: email.toLowerCase().trim(),
        confirmationCode: code,
        options: {
          clientMetadata: {
            SECRET_HASH: secretHash
          }
        }
      })
      
      console.log('✅ Email confirmed:', email)
      return result
    } catch (error: any) {
      console.error('❌ Confirm sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmationCode = async (email: string) => {
    if (!isAmplifyReady) {
      throw new Error('Authentication system not ready')
    }

    try {
      const clientId = process.env.USER_POOL_CLIENT_ID_AWS!
      const clientSecret = getClientSecret()
      const secretHash = generateSecretHash(email.toLowerCase().trim(), clientId, clientSecret)
      
      const result = await resendSignUpCode({
        username: email.toLowerCase().trim(),
        options: {
          clientMetadata: {
            SECRET_HASH: secretHash
          }
        }
      })
      
      console.log('✅ Confirmation code resent:', email)
      return result
    } catch (error: any) {
      console.error('❌ Resend confirmation error:', error)
      throw error
    }
  }

  const getAccessToken = async () => {
    try {
      const session = await fetchAuthSession()
      const accessToken = session.tokens?.accessToken?.toString()
      return accessToken || null
    } catch (error) {
      console.error('❌ Get access token error:', error)
      return null
    }
  }

  const refreshSession = async () => {
    try {
      await checkUser()
    } catch (error) {
      console.error('❌ Refresh session error:', error)
    }
  }

  const value = {
    user,
    loading,
    amplifyReady: isAmplifyReady,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    getAccessToken,
    refreshSession
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}