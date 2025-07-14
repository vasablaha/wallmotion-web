'use client'

import { useState, useEffect } from 'react'
import { ChevronRightIcon, PlayIcon, CheckIcon } from '@heroicons/react/24/solid'
import { 
  ComputerDesktopIcon, 
  CloudArrowUpIcon, 
  SwatchIcon, 
  CubeTransparentIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('vacation')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categories = [
    { id: 'vacation', name: 'Vacation', icon: '🏝️', color: 'from-green-400 to-emerald-600' },
    { id: 'nature', name: 'Nature', icon: '🌿', color: 'from-green-400 to-emerald-600' },
    { id: 'personal', name: 'Personal', icon: '📱', color: 'from-purple-400 to-pink-600' },
    { id: 'creative', name: 'Creative', icon: '🎨', color: 'from-blue-400 to-cyan-600' },
    { id: 'any', name: 'Any Video', icon: '🎬', color: 'from-gray-400 to-slate-600' }
  ]

  const features = [
    {
      icon: ComputerDesktopIcon,
      title: 'Smart Wallpaper Replacement',
      description: 'Automatically detects and replaces your current live wallpaper with one-click simplicity'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Upload Popular Formats',
      description: 'Supports MP4, MOV, and other common video formats. Drag & drop to transform your videos into wallpapers'
    },
    {
      icon: SwatchIcon,
      title: 'Perfect Quality Conversion',
      description: 'Optimizes your videos for perfect wallpaper quality while maintaining smooth performance'
    },
    {
      icon: CubeTransparentIcon,
      title: 'Beautiful Interface',
      description: 'Clean, intuitive design that makes customizing your desktop a joy'
    },
    {
      icon: GlobeAltIcon,
      title: 'Native macOS App',
      description: 'Built specifically for macOS with full system integration and sandboxed security'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Safe & Reliable',
      description: 'Automatic backups and safe file handling protect your system and current wallpapers'
    }
  ]

  const handlePurchase = async () => {
    try {
      console.log('🚀 Starting checkout process...')
      console.log('💰 Price ID:', process.env.NEXT_PUBLIC_STRIPE_PRICE_ID)
      console.log('🔑 Publishable key exists:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      console.log('🔑 Publishable key (first 20 chars):', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20))
      
      // Test API availability first
      console.log('🔍 Testing API availability...')
      try {
        const testResponse = await fetch('/api/test')
        const testData = await testResponse.json()
        console.log('✅ API test response:', testData)
      } catch (error: unknown) {
        console.error('❌ API test failed:', error)
        alert('API není dostupné! Zkontroluj server.')
        return
      }
      
      if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
        alert('❌ Chybí NEXT_PUBLIC_STRIPE_PRICE_ID v .env.local')
        return
      }

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        alert('❌ Chybí NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY v .env.local')
        return
      }

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        console.error('❌ Response status:', response.status)
        console.error('❌ Response headers:', Object.fromEntries(response.headers.entries()))
        
        if (response.status === 405) {
          alert('❌ API endpoint nenalezen! Zkontroluj, že máš soubor app/api/create-checkout/route.ts')
        } else {
          alert(`API Error (${response.status}): ${errorText}`)
        }
        return
      }

      const data = await response.json()
      console.log('✅ API Response:', data)

      if (!data.sessionId) {
        console.error('❌ No sessionId in response')
        alert('No session ID received from API')
        return
      }

      console.log('🎯 Loading Stripe...')
      const stripe = await import('@stripe/stripe-js').then(module => 
        module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      )
      
      console.log('✅ Stripe loaded:', !!stripe)
      
      if (stripe) {
        console.log('🏃 Redirecting to checkout with sessionId:', data.sessionId)
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId })
        if (result.error) {
          console.error('❌ Stripe redirect error:', result.error)
          alert(`Stripe redirect error: ${result.error.message}`)
        }
      } else {
        console.error('❌ Failed to load Stripe')
        alert('Failed to load Stripe library')
      }
    } catch (error: unknown) {
      console.error('💥 Checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Detailed error: ${errorMessage}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ComputerDesktopIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WallMotion
              </span>
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
              <button 
                onClick={handlePurchase}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Buy Now - $10
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-8">
              <span className="text-sm font-semibold text-blue-800">✨ Upload Any Video</span>
              <span className="text-sm text-blue-600">as Live Wallpaper</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Desktop Forever
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload your favorite videos (MP4, MOV) and turn them into stunning live wallpapers. 
              Smart replacement technology makes it effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={handlePurchase}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Get WallMotion - $10</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-semibold">
                <PlayIcon className="w-6 h-6" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Hero Image/Video Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
              <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30"></div>
                <PlayIcon className="w-20 h-20 text-white/80 z-10" />
                <div className="absolute bottom-4 left-4 text-white/80 text-sm font-medium">
                  Preview: WallMotion in Action
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create the perfect desktop experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upload Any Video Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From vacation memories to abstract art - any video becomes a stunning wallpaper
            </p>
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Showcase Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Your vacation videos",
              "Personal recordings", 
              "Downloaded content",
              "Creative projects",
              "Screen recordings",
              "MP4 & MOV files"
            ].map((item, index) => (
              <div key={index} className="group relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CloudArrowUpIcon className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute bottom-4 left-4 text-white font-medium">
                  {item}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              Supports popular formats: MP4, MOV, and more
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-3">
              <CheckIcon className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-semibold">Easy drag & drop upload</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600">One purchase, lifetime access</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center hover:shadow-2xl transition-all duration-300">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-semibold text-blue-800">🎉 Limited Time</span>
            </div>
            
            <div className="mb-6">
              <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$10</span>
              <span className="text-gray-600 ml-2">lifetime</span>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                'Upload unlimited videos',
                'Smart wallpaper replacement',
                'Popular video formats (MP4, MOV)',
                'Native macOS integration',
                'Automatic backups',
                'Lifetime updates'
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-3">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get WallMotion for $10
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              30-day money-back guarantee • Secure payment via Stripe
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ComputerDesktopIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">WallMotion</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Turn any video into a stunning live wallpaper for macOS. Simple drag & drop interface with smart replacement technology.
              </p>
              <div className="text-sm text-gray-500">
                © 2025 Tapp Studio. All rights reserved.
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
                <li><a href="/download" className="hover:text-white transition-colors">Download</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>Made with ❤️ for Mac users worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  )
}