import React from 'react'

type ProfileModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-6">This is a placeholder for profile details.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  )
}