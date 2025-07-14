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
      // Nejdříve zkus načíst z localStorage (DirectCognito tokeny)
      if (typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('wallmotion_auth')
        if (storedAuth) {
          const authData = JSON.parse(storedAuth)
          
          // Kontrola, jestli token není příliš starý (24 hodin)
          const loginTime = authData.loginTime || 0
          const hoursSinceLogin = (Date.now() - loginTime) / (1000 * 60 * 60)
          
          if (hoursSinceLogin < 24) {
            console.log('✅ Found valid stored auth, restoring user session')
            const mockUser = {
              username: authData.username,
              userId: authData.username,
              signInUserSession: {
                accessToken: authData.accessToken,
                idToken: authData.idToken,
                refreshToken: authData.refreshToken
              }
            }
            setUser(mockUser)
            setLoading(false)
            return
          } else {
            console.log('🕐 Stored auth expired, clearing...')
            localStorage.removeItem('wallmotion_auth')
          }
        }
      }
      
      // Fallback - zkus načíst z Amplify (standardní přihlášení)
      const currentUser = await getCurrentUser()
      console.log('✅ Current user found from Amplify:', currentUser.username)
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
      
      // Po úspěšném přihlášení nastav user state
      if (result.accessToken) {
        // Simuluj Amplify user objekt
        const mockUser = {
          username: email,
          userId: email,
          signInUserSession: {
            accessToken: result.accessToken,
            idToken: result.idToken,
            refreshToken: result.refreshToken
          }
        }
        
        // Ulož tokeny do localStorage pro persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('wallmotion_auth', JSON.stringify({
            accessToken: result.accessToken,
            idToken: result.idToken,
            refreshToken: result.refreshToken,
            username: email,
            loginTime: Date.now()
          }))
        }
        
        setUser(mockUser)
        console.log('✅ User state set after login')
      }
      
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
      console.log('📝 Attempting DIRECT Cognito sign up for:', email)
      
      // Používáme DirectCognitoAuth místo standardního signUp
      const result = await DirectCognitoAuth.signUp(email, password)
      
      console.log('✅ Direct sign up result:', result)
      return result
    } catch (error: any) {
      console.error('❌ Direct sign up error:', error)
      
      switch (error.name) {
        case 'UsernameExistsException':
          throw new Error('Účet s tímto emailem již existuje')
        case 'InvalidPasswordException':
          throw new Error('Heslo musí obsahovat velkéch malé písmeno, číslo a speciální znak')
        case 'InvalidParameterException':
          throw new Error('Neplatný formát emailu')
        default:
          throw new Error(error.message || 'Registrace se nezdařila')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      
      // Vyčisti localStorage tokeny
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wallmotion_auth')
      }
      
      // Zkus odhlásit z Amplify (může selhat pokud není Amplify session)
      try {
        await signOut()
        console.log('✅ Amplify user signed out')
      } catch (error) {
        console.log('ℹ️ No Amplify session to sign out from')
      }
      
      console.log('✅ User signed out')
      setUser(null)
    } catch (error: any) {
      console.error('❌ Sign out error:', error)
      // I při chybě vyčisti user state
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wallmotion_auth')
      }
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
      console.log('📧 Attempting DIRECT Cognito confirm sign up for:', email)
      
      // Používáme DirectCognitoAuth místo standardního confirmSignUp
      const result = await DirectCognitoAuth.confirmSignUp(email, code)
      
      console.log('✅ Direct confirm sign up result:', result)
      return result
    } catch (error: any) {
      console.error('❌ Direct confirm sign up error:', error)
      
      switch (error.name) {
        case 'CodeMismatchException':
          throw new Error('Neplatný ověřovací kód')
        case 'ExpiredCodeException':
          throw new Error('Ověřovací kód vypršel. Požádejte o nový.')
        default:
          throw new Error(error.message || 'Ověření se nezdařilo')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmationCode = async (email: string) => {
    if (!isAmplifyReady) {
      throw new Error('Authentication system not ready')
    }

    try {
      console.log('📤 Attempting DIRECT Cognito resend confirmation code for:', email)
      
      // Používáme DirectCognitoAuth místo standardního resendSignUpCode
      const result = await DirectCognitoAuth.resendConfirmationCode(email)
      
      console.log('✅ Direct resend confirmation code result:', result)
      return result
    } catch (error: any) {
      console.error('❌ Direct resend confirmation code error:', error)
      throw error
    }
  }

  const getAccessToken = async () => {
    try {
      // Nejdříve zkus načíst z localStorage (DirectCognito tokeny)
      if (typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('wallmotion_auth')
        if (storedAuth) {
          const authData = JSON.parse(storedAuth)
          const loginTime = authData.loginTime || 0
          const hoursSinceLogin = (Date.now() - loginTime) / (1000 * 60 * 60)
          
          if (hoursSinceLogin < 24 && authData.accessToken) {
            console.log('✅ Using stored access token')
            return authData.accessToken
          } else {
            console.log('🕐 Stored token expired, clearing...')
            localStorage.removeItem('wallmotion_auth')
            setUser(null)
          }
        }
      }
      
      // Fallback - zkus načíst z Amplify session
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