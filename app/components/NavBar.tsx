// app/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

interface NavbarProps {
  isScrolled: boolean
  onPurchase: () => Promise<void>
}

export default function Navbar({ isScrolled, onPurchase }: NavbarProps) {
  const { user, loading: authLoading, signOut } = useAuth()
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getPurchaseButtonText = () => {
    if (authLoading) return 'Loading...'
    if (user) return 'My Profile'
    return 'Buy Now - $10'
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WallMotion</span>
          </Link>

          {/* Desktop Navigation Links */}
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
            <Link href="/download" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Download
            </Link>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              /* Přihlášený uživatel */
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
                  Logout
                </button>
              </div>
            ) : (
              /* Nepřihlášený uživatel */
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Register
                </Link>
                <button
                  onClick={onPurchase}
                  disabled={authLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {getPurchaseButtonText()}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
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
                  Login
                </Link>
                <button
                  onClick={onPurchase}
                  disabled={authLoading}
                  className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Loading' : 'Buy $10'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}