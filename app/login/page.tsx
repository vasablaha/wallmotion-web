'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Login() {
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
    
    const callback = searchParams.get('callback')
    if (callback === 'macos') {
      setIsFromMacOSApp(true)
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
              ? 'Sign in to activate your WallMotion license' 
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Added text-black to ensure input text is black
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-black"
                  placeholder="your@email.com"
                />
              </div>

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
                  // Added text-black to ensure input text is black
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-black"
                  placeholder="Enter your password"
                />
              </div>
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
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Protected by industry-standard security • <Link href="/privacy" className="text-purple-600 hover:text-purple-800">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
