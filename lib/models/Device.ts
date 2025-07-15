// lib/models/Device.ts

import mongoose, { Schema, Document } from 'mongoose'

export interface IDevice extends Document {
  fingerprint: string
  name: string
  deviceDisplayName?: string  // NOVÉ - vlastní název zařízení nastavený uživatelem
  registeredAt: Date
  lastSeen: Date
  isActive: boolean
  isLoggedIn: boolean
  isRemoved: boolean
  macModel?: string
  macosVersion?: string
  appVersion?: string
  cognitoId: string
  removedAt?: Date
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
  deviceDisplayName: {  // NOVÉ - volitelný vlastní název
    type: String,
    default: null
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
  isLoggedIn: {
    type: Boolean,
    default: true,
    index: true
  },
  isRemoved: {
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
  removedAt: {
    type: Date,
    default: null
  }
})

export default mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema)