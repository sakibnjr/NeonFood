const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  // Restaurant Information
  restaurantName: { type: String, default: 'NeonFood Restaurant' },
  address: { type: String, default: '123 Food Street, City, State 12345' },
  phone: { type: String, default: '+1 (555) 123-4567' },
  email: { type: String, default: 'contact@neonfood.com' },
  website: { type: String, default: 'https://neonfood.com' },
  description: { type: String, default: 'A modern restaurant serving delicious food with cutting-edge technology.' },

  // Operational Settings
  defaultPrepTime: { type: Number, default: 15, min: 5, max: 60 },
  priorityUpcharge: { type: Number, default: 4.99, min: 0 },
  maxTables: { type: Number, default: 20, min: 1, max: 100 },
  serviceFee: { type: Number, default: 2.50, min: 0 },
  taxRate: { type: Number, default: 8.5, min: 0, max: 50 },

  // Operating Hours
  operatingHours: {
    monday: { open: { type: String, default: '09:00' }, close: { type: String, default: '22:00' }, closed: { type: Boolean, default: false } },
    tuesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '22:00' }, closed: { type: Boolean, default: false } },
    wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '22:00' }, closed: { type: Boolean, default: false } },
    thursday: { open: { type: String, default: '09:00' }, close: { type: String, default: '22:00' }, closed: { type: Boolean, default: false } },
    friday: { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' }, closed: { type: Boolean, default: false } },
    saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' }, closed: { type: Boolean, default: false } },
    sunday: { open: { type: String, default: '10:00' }, close: { type: String, default: '21:00' }, closed: { type: Boolean, default: false } }
  },

  // Notification Settings
  notifications: {
    newOrders: { type: Boolean, default: true },
    orderReady: { type: Boolean, default: true },
    lowStock: { type: Boolean, default: true },
    dailyReport: { type: Boolean, default: false },
    weeklyReport: { type: Boolean, default: true },
    customerReviews: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: false }
  },

  // Security Settings
  security: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 60, min: 15, max: 480 },
    passwordExpiry: { type: Number, default: 90, min: 30, max: 365 }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Settings', settingsSchema) 