const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  quantity: Number,
  price: Number
}, { _id: false })

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  tableNumber: { type: Number, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  isPriority: { type: Boolean, default: false },
  orderTime: { type: Date, default: Date.now },
  estimatedTime: { type: Number },
  completedTime: { type: Date }
})

module.exports = mongoose.model('Order', OrderSchema); 