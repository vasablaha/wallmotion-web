'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { amplifyReady } = useAuth()
  const router = useRouter()

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!amplifyReady) {
      setError('System is loading, please try again in a moment')
      setLoading(false)
      return
    }

    try {
      // TODO: Implement actual password reset with AWS Cognito
      // For now, just show success message
      setCodeSent(true)
      setSuccess('Password reset code sent to your email')
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string }
      console.error('Password reset request error:', error)
      setError(err.message || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!code || !newPassword) {
      setError('Code and new password are required')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      // TODO: Implement actual password reset confirmation with AWS Cognito
      // For now, just show success message
      setSuccess('Password reset successful! You can now sign in with your new password.')
      
      // Redirect to login after short delay
      setTimeout(() => {
        router.push('/login?message=Password reset successful, you can now sign in')
      }, 2000)
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string }
      console.error('Password reset confirmation error:', error)
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setError('')
      // TODO: Implement actual resend code with AWS Cognito
      // For now, just show success message
      setSuccess('New reset code sent to your email')
    } catch (error: unknown) {
      console.error('Resend code error:', error)
      setError('Failed to send new code')
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
        {/* Header */}
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
            {codeSent ? 'Reset Your Password' : 'Forgot Password?'}
          </h1>
          
          <p className="text-gray-600">
            {codeSent 
              ? `We sent a reset code to ${email}` 
              : 'No worries! Enter your email and we&apos;ll send you reset instructions.'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {!codeSent ? (
            /* Request Reset Form */
            <form onSubmit={handleRequestReset} className="space-y-6">
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

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-sm text-red-700 font-medium">{error}</div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-sm text-green-700 font-medium">{success}</div>
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
                    Sending Instructions...
                  </span>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            /* Confirm Reset Form */
            <form onSubmit={handleConfirmReset} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                    Reset Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    // Added text-black to ensure input text is black
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-center text-lg tracking-wider text-black"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    // Added text-black to ensure input text is black
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-black"
                    placeholder="Create a strong password"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Must be 8+ characters with uppercase, lowercase, number and special character
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-sm text-red-700 font-medium">{error}</div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-sm text-green-700 font-medium">{success}</div>
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
                    Resetting Password...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Didn&apos;t receive the code? Resend
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          {!codeSent && (
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link 
                href="/register" 
                className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
              >
                Create one here
              </Link>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Protected by industry-standard security • <Link href="/privacy" className="text-purple-600 hover:text-purple-800">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
