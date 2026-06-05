import express from 'express';
import Customer from '../models/reviews.js';
import cors from 'cors';

const router = express.Router();
router.use(cors());

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { UserID, Product, Review, Sentiment, Ratings } = req.body;
    const review = new Customer({ UserID, Product, Review, Sentiment, Ratings });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Customer.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a review by UserID
router.put('/:UserID', async (req, res) => {
  try {
    const { UserID } = req.params;
    const { Product, Review, Sentiment, Ratings } = req.body;
    const updatedReview = await Customer.findOneAndUpdate(
      { UserID },
      { Product, Review, Sentiment, Ratings },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a review by UserID
router.delete('/:UserID', async (req, res) => {
  try {
    const { UserID } = req.params;
    const deletedReview = await Customer.findOneAndDelete({ UserID });
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search reviews by UserID
router.get('/search/:UserID', async (req, res) => {
  try {
    const { UserID } = req.params;
    const review = await Customer.findOne({ UserID });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
