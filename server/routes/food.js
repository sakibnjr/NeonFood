const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all foods
router.get('/', async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// Add a food
router.post('/', async (req, res) => {
  const food = new Food(req.body);
  await food.save();
  res.status(201).json(food);
});

// Update a food
router.put('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!food) return res.status(404).json({ error: 'Food not found' })
    res.json(food)
  } catch (err) {
    res.status(400).json({ error: 'Update failed' })
  }
})

// Delete a food
router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id)
    if (!food) return res.status(404).json({ error: 'Food not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' })
  }
})

module.exports = router; 