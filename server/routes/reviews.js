const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const notificationService = require('../utils/notifications');

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add new review
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    
    // Send new review notification
    await notificationService.notifyNewReview(savedReview);
    
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update review
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET review statistics
router.get('/stats', async (req, res) => {
  try {
    const reviews = await Review.find();
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return res.json({
        totalReviews: 0,
        averageRating: 0,
        aspectRatings: {
          food: 0,
          service: 0,
          speed: 0,
          value: 0
        }
      });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    // Calculate aspect ratings
    const aspectTotals = reviews.reduce((totals, review) => {
      if (review.aspects) {
        Object.keys(review.aspects).forEach(aspect => {
          if (review.aspects[aspect] != null) {
            totals[aspect] = (totals[aspect] || 0) + review.aspects[aspect];
          }
        });
      }
      return totals;
    }, {});

    const aspectRatings = {};
    Object.keys(aspectTotals).forEach(aspect => {
      aspectRatings[aspect] = aspectTotals[aspect] / totalReviews;
    });

    res.json({
      totalReviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      aspectRatings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 