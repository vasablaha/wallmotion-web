'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isFromMacOSApp, setIsFromMacOSApp] = useState(false)
  
  const { signIn, amplifyReady } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccess(message)
    }
    
    // Kontrola zda se jedná o macOS aplikaci - podporuje jak 'app=macos' tak 'callback=macos'
    const appParam = searchParams.get('app')
    const callbackParam = searchParams.get('callback')
    
    if (appParam === 'macos' || callbackParam === 'macos') {
      setIsFromMacOSApp(true)
      console.log('🍎 Detected macOS app request')
    }
  }, [searchParams])

  const handleMacOSCallback = (userData: { username: string; [key: string]: unknown }) => {
    console.log('🍎 Handling macOS callback for user:', userData?.username)
    
    const authData = localStorage.getItem('wallmotion_auth')
    
    if (authData) {
      try {        
        const encodedToken = encodeURIComponent(authData)
        const callbackURL = `wallmotion://auth?token=${encodedToken}`
        
        console.log('🔗 Redirecting to macOS app:', callbackURL)
        
        setSuccess('Sign in successful! Redirecting to WallMotion app...')
        
        // Metoda 1: Přímé přesměrování
        setTimeout(() => {
          window.location.href = callbackURL
        }, 1500)
        
        // Metoda 2: Fallback pro některé prohlížeče
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = callbackURL
          link.click()
          link.remove()
        }, 1700)
        
        // Metoda 3: Další fallback
        setTimeout(() => {
          try {
            window.open(callbackURL, '_self')
          } catch (e) {
            console.warn('⚠️ Window.open fallback failed:', e)
          }
        }, 1900)
        
        // Pokus o zavření okna po úspěšném redirectu (pro macOS app)
        setTimeout(() => {
          try {
            window.close()
          } catch (e) {
            console.warn('⚠️ Could not close window:', e)
            // Zobraz instrukce uživateli
            setSuccess('Authentication successful! You can now close this window and return to the WallMotion app.')
          }
        }, 3000)
        
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading authentication system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-14 h-14 relative">
              <Image
                src="/logo.png"
                alt="WallMotion Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">WallMotion</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isFromMacOSApp ? 'Sign in to WallMotion' : 'Welcome back'}
          </h1>
          
          <p className="text-gray-600">
            {isFromMacOSApp 
              ? 'Enter your credentials to link your account with the WallMotion app'
              : 'Please sign in to your account'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Additional macOS app notice */}
            {isFromMacOSApp && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      You are signing in from the WallMotion macOS app
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      This window will close automatically after successful login
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <div className="text-sm text-red-700 font-medium">{error}</div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex">
                  <div className="text-sm text-green-700 font-medium">{success}</div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Links */}
            <div className="flex flex-col space-y-3 text-center">
              {!isFromMacOSApp && (
                <>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  >
                    Forgot your password?
                  </Link>
                  
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                    <span>Don&apos;t have an account?</span>
                    <Link 
                      href="/register" 
                      className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              )}
              
              {isFromMacOSApp && (
                <div className="text-sm text-gray-600">
                  <p>Need help? Visit our website at <span className="font-medium text-purple-600">wallmotion.eu</span></p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        {!isFromMacOSApp && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Protected by industry-standard security • <Link href="/privacy" className="text-purple-600 hover:text-purple-800">Privacy Policy</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  )
}