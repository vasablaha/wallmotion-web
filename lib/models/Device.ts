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
  }
})

// Odstranění explicitních indexů - jsou už definované v schema s "index: true"
// DeviceSchema.index({ fingerprint: 1 }) // DUPLIKÁT
// DeviceSchema.index({ cognitoId: 1 }) // DUPLIKÁT
// DeviceSchema.index({ isActive: 1 }) // DUPLIKÁT

export default mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema)