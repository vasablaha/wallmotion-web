'use client'

import { useState, useEffect } from 'react'
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

  // Redirect pokud není přihlášený
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Načtení dat uživatele
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const getAuthToken = async () => {
    const storedAuth = localStorage.getItem('wallmotion_auth')
    if (storedAuth) {
      const authData = JSON.parse(storedAuth)
      return authData.accessToken
    }
    return null
  }

  const loadUserData = async () => {
    setLoading(true)
    try {
      const token = await getAuthToken()
      
      if (!token) {
        setError('Nepodařilo se načíst přístupový token')
        return
      }

      // Načtení informací o uživateli
      const userResponse = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData(userData.user)
      }

      // Načtení zařízení
      const devicesResponse = await fetch('/api/devices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json()
        setDevices(devicesData.devices || [])
      }

    } catch (error) {
      console.error('Chyba při načítání dat:', error)
      setError('Nepodařilo se načíst data uživatele')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Opravdu chcete odebrat toto zařízení?')) {
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
        setSuccess('Zařízení bylo úspěšně odebráno')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Nepodařilo se odebrat zařízení')
      }
    } catch (error) {
      console.error('Chyba při odstraňování zařízení:', error)
      setError('Nepodařilo se odebrat zařízení')
    }
  }

  const handleRenameDevice = async (deviceId: string) => {
    if (!newDeviceName.trim()) {
      setError('Název zařízení nemůže být prázdný')
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
        setDevices(devices.map(device => 
          device._id === deviceId 
            ? { ...device, name: newDeviceName.trim() }
            : device
        ))
        setEditingDevice(null)
        setNewDeviceName('')
        setSuccess('Název zařízení byl úspěšně změněn')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Nepodařilo se přejmenovat zařízení')
      }
    } catch (error) {
      console.error('Chyba při přejmenování zařízení:', error)
      setError('Nepodařilo se přejmenovat zařízení')
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
        // Načtení Stripe a přesměrování
        const stripeModule = await import('@stripe/stripe-js')
        const stripe = await stripeModule.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId })
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Nepodařilo se inicializovat nákup')
      }
    } catch (error) {
      console.error('Chyba při nákupu licence:', error)
      setError('Nepodařilo se inicializovat nákup')
    }
  }

  // Výpočet počtu dostupných licencí
  const getLicenseInfo = () => {
    if (!userData) return { hasLicense: false, devicesUsed: 0, maxDevices: 0 }
    
    const hasLicense = userData.licenseType === 'LIFETIME'
    const devicesUsed = devices.length
    // Počet licencí určuje kolik zařízení může uživatel mít
    const maxDevices = userData.licensesCount || (hasLicense ? 1 : 0)
    
    return { hasLicense, devicesUsed, maxDevices }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Chyba při odhlašování:', error)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítání profilu...</p>
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
                <p className="text-gray-600">Správa účtu WallMotion</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              Odhlásit se
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
          {/* Licence */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingBagIcon className="w-6 h-6 mr-2 text-blue-600" />
                Licence a zařízení
              </h2>
            </div>

            <div className="space-y-6">
              {/* Přehled licencí */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">Stav licencí</h3>
                  <span className="text-sm text-gray-600">
                    {devicesUsed} / {maxDevices > 0 ? maxDevices : '0'} zařízení
                  </span>
                </div>
                
                {hasLicense ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">✓ Aktivní licence</span>
                      <span className="text-gray-600">
                        Zakoupena: {userData?.purchaseDate ? new Date(userData.purchaseDate).toLocaleDateString('cs-CZ') : 'N/A'}
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
                        ⚠️ Dosáhli jste limitu zařízení. Kupte další licenci pro registraci dalšího zařízení.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-2">Nemáte žádnou aktivní licenci</p>
                    <p className="text-sm text-gray-500">Kupte si první licenci pro registraci zařízení</p>
                  </div>
                )}
              </div>

              {/* Nákup licence */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {hasLicense ? 'Koupit další licenci' : 'Koupit první licenci'}
                </h3>
                
                <button
                  onClick={handlePurchaseLicense}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Licence pro 1 zařízení</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {hasLicense 
                        ? 'Přidejte licence pro další zařízení'
                        : 'Doživotní přístup k aplikaci'
                      }
                    </p>
                    <span className="text-2xl font-bold text-blue-600">$10</span>
                    <p className="text-xs text-gray-500 mt-1">Jednorázová platba za zařízení</p>
                  </div>
                </button>
                
                {hasLicense && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Každá licence umožňuje registraci jednoho dalšího zařízení
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Zařízení */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ComputerDesktopIcon className="w-6 h-6 mr-2 text-green-600" />
                Moje zařízení
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Načítání zařízení...</p>
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
                              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Název zařízení"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRenameDevice(device._id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Uložit
                              </button>
                              <button
                                onClick={() => {
                                  setEditingDevice(null)
                                  setNewDeviceName('')
                                }}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                              >
                                Zrušit
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{device.name}</h3>
                              <button
                                onClick={() => {
                                  setEditingDevice(device._id)
                                  setNewDeviceName(device.name)
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Přejmenovat zařízení"
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
                              Naposledy aktivní: {new Date(device.lastSeen).toLocaleDateString('cs-CZ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Registrováno: {new Date(device.registeredAt).toLocaleDateString('cs-CZ')}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {device.isActive ? 'Aktivní' : 'Neaktivní'}
                        </span>
                        <button
                          onClick={() => handleRemoveDevice(device._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Odebrat zařízení"
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
                <p className="text-gray-600 mb-4">Nemáte žádná registrovaná zařízení</p>
                <p className="text-sm text-gray-500">
                  Stáhněte si aplikaci a přihlaste se pro registraci zařízení
                </p>
              </div>
            )}

            {/* Pokyny pro přidání zařízení */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Jak přidat zařízení</h3>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">1</span>
                  Zakupte si licenci (pokud ji ještě nemáte)
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">2</span>
                  Stáhněte si WallMotion aplikaci na macOS
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">3</span>
                  Přihlaste se pomocí svých přihlašovacích údajů
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">4</span>
                  Zařízení se automaticky zaregistruje k vašemu účtu
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}