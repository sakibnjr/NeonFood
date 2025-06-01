const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const notificationService = require('../utils/notifications');

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ orderTime: -1 })
  res.json(orders)
})

// Add a new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    
    // Send new order notification
    await notificationService.notifyNewOrder(order)
    
    res.status(201).json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const oldOrder = await Order.findById(req.params.id)
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
    
    if (!order) return res.status(404).json({ error: 'Order not found' })
    
    // Send notification if order status changed to ready
    if (oldOrder.status !== 'ready' && order.status === 'ready') {
      await notificationService.notifyOrderReady(order)
    }
    
    res.json(order)
  } catch (err) {
    console.error('Error updating order:', err)
    res.status(400).json({ error: 'Update failed' })
  }
})

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting order:', err)
    res.status(400).json({ error: 'Delete failed' })
  }
})

module.exports = router; 