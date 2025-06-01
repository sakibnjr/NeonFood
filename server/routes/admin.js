const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const router = express.Router()

// Login endpoint
router.post('/login', async (req, res) => {
  console.log('Admin login attempt received:', req.body)
  
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      console.log('Missing username or password')
      return res.status(400).json({
        message: 'Username and password are required'
      })
    }

    console.log('Looking for admin user:', username)
    // Find admin user
    const admin = await Admin.findOne({ username })
    if (!admin) {
      console.log('Admin user not found')
      return res.status(401).json({
        message: 'Invalid username or password'
      })
    }

    console.log('Admin user found:', admin.username)
    console.log('Stored password hash:', admin.password)
    console.log('Provided password:', password)
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)
    console.log('Password comparison result:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('Invalid password')
      return res.status(401).json({
        message: 'Invalid username or password'
      })
    }

    console.log('Password valid, generating token')
    // Generate JWT token (optional - for session management)
    const token = jwt.sign(
      { userId: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    console.log('Login successful for user:', username)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        lastLogin: admin.lastLogin
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// Verify token endpoint
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  })
})

// Change password endpoint
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      })
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      })
    }

    // Find admin user
    const admin = await Admin.findById(req.user.userId)
    if (!admin) {
      return res.status(404).json({
        message: 'Admin user not found'
      })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password)
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      })
    }

    // Set new password (let the pre-save hook handle hashing)
    admin.password = newPassword
    admin.lastPasswordChange = new Date()
    await admin.save()

    res.json({
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Password change error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Logout endpoint
router.post('/logout', (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logout successful' })
})

module.exports = router 