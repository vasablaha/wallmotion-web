'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  UserCircleIcon,
  ComputerDesktopIcon,
  ShoppingBagIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface Device {
  _id: string
  name: string
  fingerprint: string
  isActive: boolean
  lastSeen: string
  macModel?: string
  macosVersion?: string
  appVersion?: string
  registeredAt: string
}

interface UserData {
  _id: string
  email: string
  licenseType: 'NONE' | 'LIFETIME'
  purchaseDate?: string
  licensesCount?: number
  createdAt: string
}

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingDevice, setEditingDevice] = useState<string | null>(null)
  const [newDeviceName, setNewDeviceName] = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

const getAuthToken = useCallback(async () => {
    const storedAuth = localStorage.getItem('wallmotion_auth')
    if (storedAuth) {
      const authData = JSON.parse(storedAuth)
      
      // Check if token is too old (over 24 hours)
      const loginTime = authData.loginTime || 0
      const hoursSinceLogin = (Date.now() - loginTime) / (1000 * 60 * 60)
      
      if (hoursSinceLogin > 24) {
        console.log('🕐 Token too old, signing out...')
        localStorage.removeItem('wallmotion_auth')
        await signOut()
        router.push('/login')
        return null
      }
      
      // Make sure we have email for potential refresh
      if (!authData.email && !authData.username) {
        console.log('⚠️ Missing email/username in stored auth, adding...')
        authData.email = user?.username || user?.email
        localStorage.setItem('wallmotion_auth', JSON.stringify(authData))
      }
      
      // Return the entire JSON as token - server will parse it
      return JSON.stringify(authData)
    }
    return null
  }, [signOut, router, user])


  // Load user data with useCallback
  const loadUserData = useCallback(async () => {
    setLoading(true)
    try {
      const token = await getAuthToken()
      
      if (!token) {
        setError('Failed to get access token')
        return
      }

      // Load user information
      const userResponse = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (userResponse.status === 401) {
        // Token expired, redirect to login
        console.log('🕐 Token expired, redirecting to login')
        localStorage.removeItem('wallmotion_auth')
        await signOut()
        router.push('/login?message=Session expired, please sign in again')
        return
      }

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData(userData.user)
      }

      // Load devices
      const devicesResponse = await fetch('/api/devices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (devicesResponse.status === 401) {
        // Token expired, redirect to login
        console.log('🕐 Token expired, redirecting to login')
        localStorage.removeItem('wallmotion_auth')
        await signOut()
        router.push('/login?message=Session expired, please sign in again')
        return
      }

      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json()
        setDevices(devicesData.devices || [])
      }

    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }, [getAuthToken, signOut, router])

  // Load user data
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user, loadUserData])

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to remove this device?')) {
      return
    }

    try {
      const token = await getAuthToken()
      
      const response = await fetch(`/api/devices?id=${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setDevices(devices.filter(device => device._id !== deviceId))
        setSuccess('Device was successfully removed')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to remove device')
      }
    } catch (error) {
      console.error('Error removing device:', error)
      setError('Failed to remove device')
    }
  }

  const handleRenameDevice = async (deviceId: string) => {
    if (!newDeviceName.trim()) {
      setError('Device name cannot be empty')
      return
    }

    try {
      const token = await getAuthToken()
      
      const response = await fetch(`/api/devices?id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newDeviceName.trim() })
      })

      if (response.ok) {
        await response.json() // Remove unused variable
        setDevices(devices.map(device => 
          device._id === deviceId 
            ? { ...device, name: newDeviceName.trim() }
            : device
        ))
        setEditingDevice(null)
        setNewDeviceName('')
        setSuccess('Device name was successfully changed')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to rename device')
      }
    } catch (error) {
      console.error('Error renaming device:', error)
      setError('Failed to rename device')
    }
  }

  const handlePurchaseLicense = async () => {
    try {
      const token = await getAuthToken()
      
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID 
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Load Stripe and redirect
        const stripeModule = await import('@stripe/stripe-js')
        const stripe = await stripeModule.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId })
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to initialize purchase')
      }
    } catch (error) {
      console.error('Error purchasing license:', error)
      setError('Failed to initialize purchase')
    }
  }

  // Calculate available licenses
  const getLicenseInfo = () => {
    if (!userData) return { hasLicense: false, devicesUsed: 0, maxDevices: 0 }
    
    const hasLicense = userData.licenseType === 'LIFETIME'
    const devicesUsed = devices.length
    // Number of licenses determines how many devices user can have
    const maxDevices = userData.licensesCount || (hasLicense ? 1 : 0)
    
    return { hasLicense, devicesUsed, maxDevices }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const { hasLicense, devicesUsed, maxDevices } = getLicenseInfo()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData?.email || user.username || user.email}
                </h1>
                <p className="text-gray-600">WallMotion Account Management</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <XCircleIcon className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-green-700">{success}</p>
              <button 
                onClick={() => setSuccess('')}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Licenses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingBagIcon className="w-6 h-6 mr-2 text-blue-600" />
                Licenses & Devices
              </h2>
            </div>

            <div className="space-y-6">
              {/* License Overview */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">License Status</h3>
                  <span className="text-sm text-gray-600">
                    {devicesUsed} / {maxDevices > 0 ? maxDevices : '0'} devices
                  </span>
                </div>
                
                {hasLicense ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">✓ Active License</span>
                      <span className="text-gray-600">
                        Purchased: {userData?.purchaseDate ? new Date(userData.purchaseDate).toLocaleDateString('en-US') : 'N/A'}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${devicesUsed >= maxDevices ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${maxDevices > 0 ? (devicesUsed / maxDevices) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                      {devicesUsed >= maxDevices && (
                        <p className="text-sm text-red-600">
                          ⚠️ You&apos;ve reached the device limit. Purchase another license to register additional devices.
                        </p>
                      )}

                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-2">No active license</p>
                    <p className="text-sm text-gray-500">Purchase your first license to register devices</p>
                  </div>
                )}
              </div>

              {/* Purchase License */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {hasLicense ? 'Buy Additional License' : 'Buy Your First License'}
                </h3>
                
                <button
                  onClick={handlePurchaseLicense}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <h4 className="font-medium mb-2">License for 1 Device</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {hasLicense 
                        ? 'Add licenses for additional devices'
                        : 'Lifetime access to the application'
                      }
                    </p>
                    <span className="text-2xl font-bold text-blue-600">$10</span>
                    <p className="text-xs text-gray-500 mt-1">One-time payment per device</p>
                  </div>
                </button>
                
                {hasLicense && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Each license allows registration of one additional device
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ComputerDesktopIcon className="w-6 h-6 mr-2 text-green-600" />
                My Devices
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading devices...</p>
              </div>
            ) : devices.length > 0 ? (
              <div className="space-y-4">
                {devices.map((device) => (
                  <div key={device._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {editingDevice === device._id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={newDeviceName}
                              onChange={(e) => setNewDeviceName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Device name"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRenameDevice(device._id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingDevice(null)
                                  setNewDeviceName('')
                                }}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{device.name}</h3>
                              <button
                                onClick={() => {
                                  setEditingDevice(device._id)
                                  setNewDeviceName(device.name)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </div>
                            {device.macModel && (
                              <p className="text-sm text-gray-600">Model: {device.macModel}</p>
                            )}
                            {device.macosVersion && (
                              <p className="text-sm text-gray-600">macOS: {device.macosVersion}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              Last active: {new Date(device.lastSeen).toLocaleDateString('en-US')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Registered: {new Date(device.registeredAt).toLocaleDateString('en-US')}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {device.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleRemoveDevice(device._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove device"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ComputerDesktopIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No registered devices</h3>
                <p className="text-gray-600 mb-4">
                  Download and sign in to the WallMotion app to register your device
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>1. Purchase a license</p>
                  <p>2. Download the WallMotion app for macOS</p>
                  <p>3. Sign in with your account credentials</p>
                  <p>4. Your device will automatically register</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}