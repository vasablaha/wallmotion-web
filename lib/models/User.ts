import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  cognitoId: string
  email: string
  stripeCustomerId?: string
  purchaseDate?: Date
  licenseType: 'NONE' | 'LIFETIME' | 'SUBSCRIPTION'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  cognitoId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  stripeCustomerId: {
    type: String,
    default: null,
    index: true
  },
  purchaseDate: {
    type: Date,
    default: null
  },
  licenseType: {
    type: String,
    enum: ['NONE', 'LIFETIME', 'SUBSCRIPTION'],
    default: 'NONE'
  }
}, {
  timestamps: true // Automaticky vytvoří createdAt a updatedAt
})

// Odstranění explicitních indexů - jsou už definované v schema s "index: true"
// UserSchema.index({ cognitoId: 1 }) // DUPLIKÁT
// UserSchema.index({ email: 1 }) // DUPLIKÁT  
// UserSchema.index({ stripeCustomerId: 1 }) // DUPLIKÁT

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)