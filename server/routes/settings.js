const express = require('express')
const bcrypt = require('bcryptjs')
const Settings = require('../models/Settings')
const Admin = require('../models/Admin')
const router = express.Router()

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne()
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        restaurantName: 'NeonFood Restaurant',
        address: '123 Food Street, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'contact@neonfood.com',
        website: 'https://neonfood.com',
        description: 'A modern restaurant serving delicious food with cutting-edge technology.',
        operatingHours: {
          monday: { open: '09:00', close: '22:00', closed: false },
          tuesday: { open: '09:00', close: '22:00', closed: false },
          wednesday: { open: '09:00', close: '22:00', closed: false },
          thursday: { open: '09:00', close: '22:00', closed: false },
          friday: { open: '09:00', close: '23:00', closed: false },
          saturday: { open: '09:00', close: '23:00', closed: false },
          sunday: { open: '10:00', close: '21:00', closed: false }
        }
      })
      await settings.save()
    }
    
    res.json(settings)
  } catch (error) {
    console.error('Error loading settings:', error)
    res.status(500).json({ message: 'Failed to load settings' })
  }
})

// Save/update settings
router.post('/', async (req, res) => {
  try {
    let settings = await Settings.findOne()
    
    if (settings) {
      // Update existing settings
      Object.assign(settings, req.body)
      await settings.save()
    } else {
      // Create new settings
      settings = new Settings(req.body)
      await settings.save()
    }
    
    res.json(settings)
  } catch (error) {
    console.error('Error saving settings:', error)
    res.status(500).json({ message: 'Failed to save settings' })
  }
})

// Change admin password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' })
    }
    
    // Find admin user (assuming single admin for simplicity)
    const admin = await Admin.findOne()
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' })
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password)
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    
    // Hash new password
    const saltRounds = 10
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)
    
    // Update password
    admin.password = hashedNewPassword
    admin.lastPasswordChange = new Date()
    await admin.save()
    
    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({ message: 'Failed to change password' })
  }
})

module.exports = router 