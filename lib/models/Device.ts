// Aktualizace Device modelu - přidat nové stavy
// lib/models/Device.ts

import mongoose, { Schema, Document } from 'mongoose'

export interface IDevice extends Document {
  fingerprint: string
  name: string
  registeredAt: Date
  lastSeen: Date
  isActive: boolean
  isLoggedIn: boolean  // NOVÉ - zda je uživatel přihlášen
  isRemoved: boolean   // NOVÉ - zda bylo zařízení odebráno (blocked fingerprint)
  macModel?: string
  macosVersion?: string
  appVersion?: string
  cognitoId: string
  removedAt?: Date     // NOVÉ - kdy bylo odebráno
}

const DeviceSchema = new Schema<IDevice>({
  fingerprint: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isLoggedIn: {  // NOVÉ
    type: Boolean,
    default: true,
    index: true
  },
  isRemoved: {   // NOVÉ
    type: Boolean,
    default: false,
    index: true
  },
  macModel: {
    type: String,
    default: null
  },
  macosVersion: {
    type: String,
    default: null
  },
  appVersion: {
    type: String,
    default: null
  },
  cognitoId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  removedAt: {   // NOVÉ
    type: Date,
    default: null
  }
})

export default mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema)