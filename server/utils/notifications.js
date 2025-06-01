const Settings = require('../models/Settings')

class NotificationService {
  constructor() {
    this.settings = null
    this.loadSettings()
  }

  async loadSettings() {
    try {
      this.settings = await Settings.findOne()
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    }
  }

  async refreshSettings() {
    await this.loadSettings()
  }

  async shouldSendNotification(type) {
    if (!this.settings) {
      await this.loadSettings()
    }
    
    return this.settings?.notifications?.[type] || false
  }

  async sendNotification(type, data) {
    const shouldSend = await this.shouldSendNotification(type)
    
    if (!shouldSend) {
      console.log(`Notification type '${type}' is disabled in settings`)
      return
    }

    console.log(`🔔 Notification [${type.toUpperCase()}]:`, data)
    
    // Here you could integrate with real notification services:
    // - Email service (SendGrid, Nodemailer)
    // - SMS service (Twilio)
    // - Push notifications (Firebase)
    // - Slack/Discord webhooks
    // - Desktop notifications

    switch (type) {
      case 'newOrders':
        this.handleNewOrderNotification(data)
        break
      case 'orderReady':
        this.handleOrderReadyNotification(data)
        break
      case 'lowStock':
        this.handleLowStockNotification(data)
        break
      case 'customerReviews':
        this.handleCustomerReviewNotification(data)
        break
      case 'dailyReport':
        this.handleDailyReportNotification(data)
        break
      case 'weeklyReport':
        this.handleWeeklyReportNotification(data)
        break
      case 'systemUpdates':
        this.handleSystemUpdateNotification(data)
        break
      default:
        console.log(`Unknown notification type: ${type}`)
    }
  }

  handleNewOrderNotification(data) {
    const { order } = data
    console.log(`📦 New Order #${order.orderNumber} from ${order.customerName}`)
    console.log(`   Total: $${order.total} | Items: ${order.items.length}`)
    if (order.isPriority) {
      console.log(`   ⚡ PRIORITY ORDER - Expedite!`)
    }
  }

  handleOrderReadyNotification(data) {
    const { order } = data
    console.log(`✅ Order #${order.orderNumber} is ready for pickup`)
    console.log(`   Customer: ${order.customerName} | Table: ${order.tableNumber}`)
  }

  handleLowStockNotification(data) {
    const { item, currentStock, minStock } = data
    console.log(`⚠️  Low Stock Alert: ${item}`)
    console.log(`   Current: ${currentStock} | Minimum: ${minStock}`)
  }

  handleCustomerReviewNotification(data) {
    const { review } = data
    const stars = '⭐'.repeat(review.rating)
    console.log(`💬 New Review: ${stars} (${review.rating}/5)`)
    console.log(`   From: ${review.customerName}`)
    console.log(`   Comment: "${review.comment}"`)
  }

  handleDailyReportNotification(data) {
    const { report } = data
    console.log(`📊 Daily Report - ${new Date().toDateString()}`)
    console.log(`   Orders: ${report.totalOrders} | Revenue: $${report.totalRevenue}`)
    console.log(`   Avg Prep Time: ${report.avgPrepTime} min`)
  }

  handleWeeklyReportNotification(data) {
    const { report } = data
    console.log(`📈 Weekly Report - Week of ${report.weekStart}`)
    console.log(`   Orders: ${report.totalOrders} | Revenue: $${report.totalRevenue}`)
    console.log(`   Growth: ${report.growth}%`)
  }

  handleSystemUpdateNotification(data) {
    const { update } = data
    console.log(`🔧 System Update: ${update.title}`)
    console.log(`   ${update.description}`)
    console.log(`   Scheduled: ${update.scheduledTime}`)
  }

  // Utility methods for common notification triggers
  async notifyNewOrder(order) {
    await this.sendNotification('newOrders', { order })
  }

  async notifyOrderReady(order) {
    await this.sendNotification('orderReady', { order })
  }

  async notifyLowStock(item, currentStock, minStock) {
    await this.sendNotification('lowStock', { item, currentStock, minStock })
  }

  async notifyNewReview(review) {
    await this.sendNotification('customerReviews', { review })
  }

  async notifyDailyReport(report) {
    await this.sendNotification('dailyReport', { report })
  }

  async notifyWeeklyReport(report) {
    await this.sendNotification('weeklyReport', { report })
  }

  async notifySystemUpdate(update) {
    await this.sendNotification('systemUpdates', { update })
  }
}

// Create singleton instance
const notificationService = new NotificationService()

module.exports = notificationService 