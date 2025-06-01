const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ orderTime: -1 })
  res.json(orders)
})

// Add a new order
router.post('/', async (req, res) => {
  const order = new Order(req.body)
  await order.save()
  res.status(201).json(order)
})

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
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
    res.status(400).json({ error: 'Delete failed' })
  }
})

module.exports = router; 