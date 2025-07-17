'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    if (sessionId) {
      // Můžete zde ověřit platbu
      setEmailSent(true)
    }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for purchasing WallMotion. We&apos;ve sent download instructions to your email.
        </p>
        
        {emailSent && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 text-sm">
              📧 Download link sent to your email!
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <a 
            href={process.env.DOWNLOAD_URL}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Direct Download</span>
          </a>
          
          <Link 
            href="/"
            className="block text-gray-600 hover:text-purple-600 transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Transaction ID: {sessionId}
          </p>
        </div>
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

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  )
}