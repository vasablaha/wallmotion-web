'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { signUp, confirmSignUp, resendConfirmationCode, amplifyReady } = useAuth()
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
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

    if (password.length < 8) {
      setError('Heslo musí mít minimálně 8 znaků')
      setLoading(false)
      return
    }

    try {
      await signUp(email, password)
      setNeedsConfirmation(true)
      setSuccess('Registrace úspěšná! Zkontrolujte email pro ověřovací kód.')
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle specific Cognito errors
      switch (error.code) {
        case 'UsernameExistsException':
          setError('Účet s tímto emailem již existuje')
          break
        case 'InvalidPasswordException':
          setError('Heslo musí obsahovat velkéch malé písmeno, číslo a speciální znak')
          break
        case 'InvalidParameterException':
          setError('Neplatný formát emailu')
          break
        default:
          setError(error.message || 'Registrace se nezdařila')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!confirmationCode) {
      setError('Ověřovací kód je povinný')
      setLoading(false)
      return
    }

    try {
      await confirmSignUp(email, confirmationCode)
      setSuccess('Email ověřen! Můžete se nyní přihlásit.')
      
      // Redirect to login after short delay
      setTimeout(() => {
        router.push('/login?message=Účet ověřen, můžete se přihlásit')
      }, 2000)
    } catch (error: any) {
      console.error('Confirmation error:', error)
      
      switch (error.code) {
        case 'CodeMismatchException':
          setError('Neplatný ověřovací kód')
          break
        case 'ExpiredCodeException':
          setError('Ověřovací kód vypršel. Požádejte o nový.')
          break
        default:
          setError(error.message || 'Ověření se nezdařilo')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setError('')
      await resendConfirmationCode(email)
      setSuccess('Nový ověřovací kód byl odeslán na váš email')
    } catch (error: any) {
      setError('Nepodařilo se odeslat nový kód')
    }
  }

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

  if (needsConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Ověřte svůj email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Poslali jsme ověřovací kód na{' '}
              <span className="font-medium text-blue-600">{email}</span>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleConfirmSignUp}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Ověřovací kód
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Zadejte 6-místný kód"
                maxLength={6}
              />
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Ověřování...' : 'Ověřit účet'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Poslat nový kód
              </button>
            </div>
          </form>
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
            Vytvořte si účet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Začněte používat WallMotion zdarma
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Minimálně 8 znaků"
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-500">
                Musí obsahovat velkéch malé písmeno, číslo a speciální znak
              </p>
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Vytváří se účet...' : 'Vytvořit účet'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Již máte účet?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Přihlásit se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}