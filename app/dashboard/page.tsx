'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface Device {
  _id: string
  fingerprint: string
  name: string
  registeredAt: string
  lastSeen: string
  isActive: boolean
  macModel?: string
  macosVersion?: string
  appVersion?: string
}

interface UserData {
  cognitoId: string
  email: string
  licenseType: 'NONE' | 'LIFETIME' | 'SUBSCRIPTION'
  purchaseDate?: string
  stripeCustomerId?: string
}

export default function Dashboard() {
  const { user, getAccessToken, signOut } = useAuth()
  const router = useRouter()
  
  const [userData, setUserData] = useState<UserData | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    loadDashboardData()
  }, [user, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const accessToken = await getAccessToken()
      
      if (!accessToken) {
        throw new Error('No access token')
      }

      // Load user data
      const userResponse = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData(userData.user)
      }

      // Load devices
      const devicesResponse = await fetch('/api/devices', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json()
        setDevices(devicesData.devices)
      }

    } catch (error: any) {
      console.error('Dashboard load error:', error)
      setError('Nepodařilo se načíst data')
    } finally {
      setLoading(false)
    }
  }

  const handleRenameDevice = async (deviceId: string, currentName: string) => {
    const newName = prompt('Zadejte nový název zařízení:', currentName)
    
    if (!newName || newName.trim() === currentName) {
      return
    }

    try {
      const accessToken = await getAccessToken()
      
      const response = await fetch(`/api/devices?id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName.trim() })
      })

      if (response.ok) {
        await loadDashboardData()
      } else {
        const error = await response.json()
        alert(error.error || 'Nepodařilo se přejmenovat zařízení')
      }
    } catch (error) {
      console.error('Rename device error:', error)
      alert('Nepodařilo se přejmenovat zařízení')
    }
  }

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Opravdu chcete odebrat toto zařízení?')) {
      return
    }

    try {
      const accessToken = await getAccessToken()
      
      const response = await fetch(`/api/devices?id=${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        await loadDashboardData()
      } else {
        const error = await response.json()
        alert(error.error || 'Nepodařilo se odebrat zařízení')
      }
    } catch (error) {
      console.error('Remove device error:', error)
      alert('Nepodařilo se odebrat zařízení')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'právě teď'
    if (diffInHours < 24) return `před ${diffInHours} hodinami`
    if (diffInHours < 48) return 'včera'
    return `před ${Math.floor(diffInHours / 24)} dny`
  }

  const getLicenseStatusBadge = (licenseType: string) => {
    switch (licenseType) {
      case 'LIFETIME':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Lifetime License
          </span>
        )
      case 'SUBSCRIPTION':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Aktivní předplatné
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Žádná licence
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítám dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">W</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">WallMotion Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Ahoj, {user?.username}</span>
              <button
                onClick={signOut}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Odhlásit se
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* License Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow px-6 py-6">
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Stav licence</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  {userData && getLicenseStatusBadge(userData.licenseType)}
                </div>
                
                {userData?.purchaseDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Zakoupeno: {formatDate(userData.purchaseDate)}
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <strong>Email:</strong> {userData?.email}
                </div>

                {userData?.licenseType === 'NONE' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-3">
                      Pro používání WallMotion potřebujete platnou licenci.
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Zakoupit licenci
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ComputerDesktopIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Registrovaná zařízení</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {devices.filter(d => d.isActive).length} / 1 aktivních
                  </span>
                </div>
              </div>

              <div className="p-6">
                {devices.length === 0 ? (
                  <div className="text-center py-8">
                    <DevicePhoneMobileIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Žádná zařízení</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Zatím nemáte registrovaná žádná zařízení.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Stáhnout aplikaci
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {devices.map((device) => (
                      <div
                        key={device._id}
                        className={`border rounded-lg p-4 ${
                          device.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ComputerDesktopIcon className={`h-5 w-5 mr-3 ${
                              device.isActive ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {device.name}
                              </h3>
                              <div className="text-xs text-gray-500 space-y-1">
                                {device.macModel && (
                                  <div>{device.macModel}</div>
                                )}
                                {device.macosVersion && (
                                  <div>macOS {device.macosVersion}</div>
                                )}
                                {device.appVersion && (
                                  <div>WallMotion v{device.appVersion}</div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right text-xs text-gray-500">
                              <div className="flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatRelativeTime(device.lastSeen)}
                              </div>
                              <div>
                                Registrováno: {formatDate(device.registeredAt)}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleRenameDevice(device._id, device.name)}
                                className="text-blue-600 hover:text-blue-700"
                                title="Přejmenovat zařízení"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => handleRemoveDevice(device._id)}
                                className="text-red-600 hover:text-red-700"
                                title="Odebrat zařízení"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Stáhnout WallMotion</h3>
              <p className="mt-1 text-sm text-gray-500">
                Nejnovější verze aplikace pro macOS
              </p>
            </div>
            <a
              href={process.env.DOWNLOAD_URL || '#'}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Stáhnout pro Mac
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}