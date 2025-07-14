import React from 'react'
import { ComputerDesktopIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

type NavigationProps = {
  isScrolled: boolean
  onPurchase: () => Promise<void>
}

export default function Navigation({ isScrolled, onPurchase }: NavigationProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Po odhlášení se přesměruje na hlavní stránku
      window.location.href = '/'
    } catch (error) {
      console.error('Chyba při odhlašování:', error)
    }
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ComputerDesktopIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WallMotion
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Features
            </a>
            <a href="#gallery" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Gallery
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Pricing
            </a>
            
            {/* Přihlášený uživatel */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="max-w-[150px] truncate">
                    {user.username || user.email}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-red-600 transition-colors font-medium text-sm"
                >
                  Odhlásit
                </button>
              </div>
            ) : (
              /* Nepřihlášený uživatel */
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Přihlášení
                </Link>
                <Link
                  href="/register"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Registrace
                </Link>
                <button
                  onClick={onPurchase}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Buy Now - $10
                </button>
              </div>
            )}
          </div>

          {/* Mobilní menu */}
          <div className="md:hidden">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <UserCircleIcon className="w-6 h-6" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Přihlášení
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}