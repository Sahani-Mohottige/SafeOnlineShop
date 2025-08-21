const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { protect } = require('../middleware/authMiddleware');

// List of allowed delivery locations (districts)
const districts = [
  'Colombo', 'Gampaha', 'Kandy', 'Galle', 'Matara', 'Kurunegala', 'Jaffna', 'Badulla', 'Anuradhapura', 'Ratnapura'
];

// List of allowed products (example)
const products = [
  'T-Shirt', 'Dress', 'Shoes', 'Bag', 'Watch', 'Sunglasses', 'Hat', 'Jeans', 'Jacket', 'Skirt'
];

// Get user profile
router.get('/profile', protect, (req, res) => {
  const user = req.user;
  res.json({
    username: user.name || user.nickname,
    name: user.name,
    email: user.email,
    contactNumber: user.contactNumber || '',
    country: user.country || ''
  });
});

// Create a purchase
router.post('/', protect, async (req, res) => {
  try {
    const { dateOfPurchase, deliveryTime, deliveryLocation, productName, quantity, message } = req.body;
    // Validate date (not Sunday, not past)
    const purchaseDate = new Date(dateOfPurchase);
    const today = new Date();
    if (purchaseDate < today) {
      return res.status(400).json({ message: 'Date of purchase must be today or in the future.' });
    }
    if (purchaseDate.getDay() === 0) {
      return res.status(400).json({ message: 'Purchases cannot be made on Sundays.' });
    }
    // Validate delivery time
    if (!['10 AM', '11 AM', '12 PM'].includes(deliveryTime)) {
      return res.status(400).json({ message: 'Invalid delivery time.' });
    }
    // Validate delivery location
    if (!districts.includes(deliveryLocation)) {
      return res.status(400).json({ message: 'Invalid delivery location.' });
    }
    // Validate product name
    if (!products.includes(productName)) {
      return res.status(400).json({ message: 'Invalid product name.' });
    }
    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }
    const purchase = await Purchase.create({
      user: req.user._id,
      username: req.user.name || req.user.nickname,
      dateOfPurchase: purchaseDate,
      deliveryTime,
      deliveryLocation,
      productName,
      quantity,
      message
    });
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase', error: error.message });
  }
});

// Get all purchases for the authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id }).sort({ dateOfPurchase: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
});

module.exports = router;
