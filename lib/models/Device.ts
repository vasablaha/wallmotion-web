import mongoose, { Schema, Document } from 'mongoose'

export interface IDevice extends Document {
  fingerprint: string
  name: string
  registeredAt: Date
  lastSeen: Date
  isActive: boolean
  macModel?: string
  macosVersion?: string
  appVersion?: string
  cognitoId: string
}

const DeviceSchema = new Schema<IDevice>({
  fingerprint: {
    type: String,
    required: true,
    unique: true
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
    default: true
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
    ref: 'User'
  }
})

// Indexy pro rychlejší vyhledávání
DeviceSchema.index({ fingerprint: 1 })
DeviceSchema.index({ cognitoId: 1 })
DeviceSchema.index({ isActive: 1 })

export default mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema)