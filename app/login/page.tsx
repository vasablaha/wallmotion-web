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
      console.log('✅ Login: User already logged in, redirecting to home')
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Basic validation
    if (!email || !password) {
      setError('Email a heslo jsou povinné')
      setLoading(false)
      return
    }

    if (!amplifyReady) {
      setError('Systém se načítá, zkuste to za chvilku')
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Attempting login for:', email)
      
      const result = await signIn(email, password)
      
      console.log('✅ Login successful:', result)
      setSuccess('Přihlášení úspěšné! Přesměrováváme vás...')
      
      // Redirect to dashboard or home page after short delay
      setTimeout(() => {
        router.push('/')
      }, 1500)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Přihlášení se nezdařilo'
      console.error('❌ Login error:', error)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Show loading screen while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kontroluji přihlášení...</p>
        </div>
      </div>
    )
  }

  // Show loading screen while Amplify initializes
  if (!amplifyReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítá se autentifikační systém...</p>
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
            Přihlaste se do svého účtu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nebo{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              si vytvořte nový účet
            </Link>
          </p>
        </div>

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
                placeholder="váš@email.cz"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Heslo
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
                placeholder="Zadejte vaše heslo"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Zapamatovat si mě
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Zapomněli jste heslo?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Přihlašování...' : 'Přihlásit se'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Nemáte účet?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Vytvořte si ho zde
              </Link>
            </p>
          </div>
        </form>

        {/* Additional features info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Přihlášením souhlasíte s našimi{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Podmínkami používání
              </Link>{' '}
              a{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Zásadami ochrany soukromí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Načítá se přihlášení...</p>
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