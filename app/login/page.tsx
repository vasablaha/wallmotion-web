// app/login/page.tsx - Upravený pro macOS aplikaci

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { signIn, amplifyReady, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check if this is from macOS app
  const isFromMacOSApp = searchParams.get('app') === 'macos'

  // Check for messages from URL params (like after successful registration)
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccess(decodeURIComponent(message))
    }
  }, [searchParams])

  // Redirect if already logged in - but wait for auth to load
  useEffect(() => {
    console.log('🔐 Login: Auth state:', { user: !!user, authLoading, username: user?.username })
    
    if (authLoading) {
      console.log('⏳ Login: Auth loading, waiting...')
      return
    }
    
    if (user) {
      console.log('✅ Login: User already logged in')
      
      if (isFromMacOSApp) {
        // Redirect to macOS callback
        handleMacOSCallback(user)
      } else {
        // Normal redirect to home
        router.push('/')
      }
    }
  }, [user, authLoading, router, isFromMacOSApp])

  const handleMacOSCallback = (userData: { username?: string; [key: string]: unknown }) => {
    console.log('🍎 Handling macOS callback for user:', userData?.username)
    
    // Get auth data from localStorage (created by DirectCognitoAuth)
    const authData = localStorage.getItem('wallmotion_auth')
    
    if (authData) {
      try {        
        // Create callback URL with auth token
        const encodedToken = encodeURIComponent(authData)
        const callbackURL = `wallmotion://auth?token=${encodedToken}`
        
        console.log('🔗 Redirecting to macOS app:', callbackURL)
        
        // Show success message
        setSuccess('Sign in successful! Redirecting to WallMotion app...')
        
        // Redirect back to macOS app
        setTimeout(() => {
          window.location.href = callbackURL
        }, 1500)
        
      } catch (error) {
        console.error('❌ Error parsing auth data:', error)
        setError('Authentication successful but failed to redirect to app')
      }
    } else {
      console.error('❌ No auth data found in localStorage')
      setError('Authentication successful but no session data found')
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    if (!amplifyReady) {
      setError('System is loading, please try again in a moment')
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Attempting login for:', email)
      
      const result = await signIn(email, password)
      
      console.log('✅ Login successful:', result)
      
      if (isFromMacOSApp) {
        setSuccess('Sign in successful! Redirecting to WallMotion app...')
        
        // Wait a bit for localStorage to be updated, then redirect
        setTimeout(() => {
          handleMacOSCallback(result)
        }, 1000)
      } else {
        setSuccess('Sign in successful! Redirecting...')
        
        // Normal redirect to home page
        setTimeout(() => {
          router.push('/')
        }, 1500)
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      console.error('❌ Login error:', error)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!amplifyReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isFromMacOSApp ? 'Sign in to WallMotion' : 'Sign in to your account'}
          </h2>
          {isFromMacOSApp ? (
            <p className="mt-2 text-center text-sm text-blue-600">
              🍎 Signing in from WallMotion macOS app
            </p>
          ) : (
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : (isFromMacOSApp ? 'Sign In to WallMotion' : 'Sign In')}
            </button>
          </div>

          {!isFromMacOSApp && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Create one here
                </Link>
              </p>
            </div>
          )}
        </form>

        {/* Additional features info */}
        {!isFromMacOSApp && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* macOS App Info */}
        {isFromMacOSApp && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                🍎 You will be redirected back to the WallMotion app after signing in
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoginLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading sign in...</p>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  )
}