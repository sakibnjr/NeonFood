const mongoose = require('mongoose');
const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  deliveryTime: { type: Number },
  rating: { type: Number },
  popular: { type: Boolean, default: false }
});
module.exports = mongoose.model('Food', FoodSchema); 