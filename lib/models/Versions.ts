// lib/models/Version.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IVersion extends Document {
  version: string
  buildNumber: string
  downloadUrl: string
  releaseDate: Date
  releaseNotes: string[]
  minimumVersion: string
  forceUpdate: boolean
  bundleId: string
  isActive: boolean // Zda je verze aktivní/dostupná
  isPrerelease: boolean // Beta/preview verze
  channel: 'stable' | 'beta' | 'alpha' // Release channel
  fileSize?: number // Velikost souboru v bytech
  sha256?: string // Checksum pro ověření integrity
  createdAt: Date
  updatedAt: Date
}

const VersionSchema = new Schema<IVersion>({
  version: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: function(v: string) {
        // Semantic versioning validation (X.Y.Z)
        return /^\d+\.\d+\.\d+$/.test(v)
      },
      message: 'Version must follow semantic versioning (X.Y.Z)'
    }
  },
  buildNumber: {
    type: String,
    required: true
  },
  downloadUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Download URL must be a valid HTTP/HTTPS URL'
    }
  },
  releaseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  releaseNotes: {
    type: [String],
    default: []
  },
  minimumVersion: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d+\.\d+\.\d+$/.test(v)
      },
      message: 'Minimum version must follow semantic versioning (X.Y.Z)'
    }
  },
  forceUpdate: {
    type: Boolean,
    default: false
  },
  bundleId: {
    type: String,
    required: true,
    default: 'tapp-studio.WallMotion',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isPrerelease: {
    type: Boolean,
    default: false,
    index: true
  },
  channel: {
    type: String,
    enum: ['stable', 'beta', 'alpha'],
    default: 'stable',
    index: true
  },
  fileSize: {
    type: Number,
    min: 0
  },
  sha256: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^[a-f0-9]{64}$/i.test(v)
      },
      message: 'SHA256 must be a valid 64-character hexadecimal string'
    }
  }
}, {
  timestamps: true
})

// Compound index pro efektivní dotazy
VersionSchema.index({ bundleId: 1, channel: 1, isActive: 1, releaseDate: -1 })
VersionSchema.index({ bundleId: 1, version: 1 }, { unique: true })

// Virtual property pro formátovanou velikost souboru
VersionSchema.virtual('fileSizeFormatted').get(function() {
  if (!this.fileSize) return null
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024))
  return Math.round((this.fileSize / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
})

// Static method pro získání nejnovější verze
VersionSchema.statics.getLatestVersion = function(bundleId: string, channel: string = 'stable') {
  return this.findOne({
    bundleId,
    channel,
    isActive: true,
    isPrerelease: channel !== 'stable'
  }).sort({ releaseDate: -1 })
}

// Static method pro porovnání verzí
VersionSchema.statics.compareVersions = function(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number)
  const v2Parts = version2.split('.').map(Number)
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0
    const v2Part = v2Parts[i] || 0
    
    if (v1Part > v2Part) return 1
    if (v1Part < v2Part) return -1
  }
  
  return 0
}

// Instance method pro kontrolu, zda je verze novější než zadaná
VersionSchema.methods.isNewerThan = function(compareVersion: string): boolean {
  const VersionModel = this.constructor as any
  return VersionModel.compareVersions(this.version, compareVersion) > 0
}

// Instance method pro kontrolu kompatibility
VersionSchema.methods.isCompatibleWith = function(currentVersion: string): boolean {
  const VersionModel = this.constructor as any
  return VersionModel.compareVersions(currentVersion, this.minimumVersion) >= 0
}

export default mongoose.models.Version || mongoose.model<IVersion>('Version', VersionSchema)