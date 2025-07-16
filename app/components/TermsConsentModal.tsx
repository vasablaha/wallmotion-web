// app/components/TermsConsentModal.tsx
'use client'

import { useState } from 'react'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface TermsConsentModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (consents: {
    acceptedTerms: boolean
    acceptedPrivacy: boolean
    acceptedDmca: boolean
  }) => void
  loading?: boolean
}

export default function TermsConsentModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  loading = false 
}: TermsConsentModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedDmca, setAcceptedDmca] = useState(false)
  const [error, setError] = useState('')

  const handleAccept = () => {
    if (!acceptedTerms || !acceptedPrivacy || !acceptedDmca) {
      setError('You must accept all policies to continue')
      return
    }
    
    setError('')
    onAccept({
      acceptedTerms,
      acceptedPrivacy,
      acceptedDmca
    })
  }

  const handleClose = () => {
    if (loading) return
    setAcceptedTerms(false)
    setAcceptedPrivacy(false)
    setAcceptedDmca(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Legal Agreement Required
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Important Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-800 font-semibold">Important Copyright Notice</h3>
                <p className="text-amber-700 text-sm mt-1">
                  You are solely responsible for ensuring you have the right to use any video content you process with WallMotion. 
                  This includes obtaining proper permissions for copyrighted material and complying with YouTubes Terms of Service.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I have read and agree to the{' '}
                <Link 
                  href="/terms" 
                  target="_blank" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Terms of Service
                </Link>
                {' '}and understand my responsibilities regarding video content usage.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                I have read and agree to the{' '}
                <Link 
                  href="/privacy" 
                  target="_blank" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Privacy Policy
                </Link>
                {' '}and understand how my data will be processed.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="dmca"
                checked={acceptedDmca}
                onChange={(e) => setAcceptedDmca(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="dmca" className="text-sm text-gray-700">
                I have read and agree to the{' '}
                <Link 
                  href="/dmca" 
                  target="_blank" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  DMCA Policy
                </Link>
                {' '}and understand my obligations regarding copyrighted content.
              </label>
            </div>
          </div>

          {/* Copyright Responsibility */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Your Copyright Responsibilities:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Only use videos you own or have permission to use</li>
              <li>• Comply with YouTube s Terms of Service when importing videos</li>
              <li>• Respect content creators intellectual property rights</li>
              <li>• You are liable for any copyright infringement claims</li>
              <li>• WallMotion is not responsible for your content usage</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={loading || !acceptedTerms || !acceptedPrivacy || !acceptedDmca}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{loading ? 'Processing...' : 'Accept and Continue to Payment'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}