const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  orderId: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
  aspects: {
    food: { type: Number, min: 0, max: 5 },
    service: { type: Number, min: 0, max: 5 },
    speed: { type: Number, min: 0, max: 5 },
    value: { type: Number, min: 0, max: 5 }
  }
})

module.exports = mongoose.model('Review', ReviewSchema); 