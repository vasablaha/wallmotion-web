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
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  stripeCustomerId: {
    type: String,
    default: null
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

// Indexy pro rychlejší vyhledávání
UserSchema.index({ cognitoId: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ stripeCustomerId: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)