
const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { protect } = require('../middleware/authMiddleware');

// Delete a purchase by ID
router.delete('/:id', protect, async (req, res) => {
  try {
    const purchase = await Purchase.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found or not authorized' });
    }
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase', error: error.message });
  }
});

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
    const { products, dateOfPurchase, deliveryTime, deliveryLocation, message } = req.body;
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
    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products array is required and cannot be empty.' });
    }
    for (const p of products) {
      if (!p.productId || !p.name || !p.quantity || p.quantity < 1 || !p.price) {
        return res.status(400).json({ message: 'Each product must have productId, name, price, and quantity >= 1.' });
      }
      // Optionally validate allowed product names
      // if (!productsList.includes(p.name)) {
      //   return res.status(400).json({ message: `Invalid product name: ${p.name}` });
      // }
    }
    const purchase = await Purchase.create({
      user: req.user._id,
      username: req.user.name || req.user.nickname,
      dateOfPurchase: purchaseDate,
      deliveryTime,
      deliveryLocation,
      products,
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
    if (!req.user) {
      console.error('[DEBUG] /api/purchases: req.user is undefined');
      return res.status(400).json({ message: 'User not found in request context' });
    }
    console.log('[DEBUG] /api/purchases: req.user:', req.user);
    const purchases = await Purchase.find({ user: req.user._id }).sort({ dateOfPurchase: -1 });
    res.json(purchases);
  } catch (error) {
    console.error('[DEBUG] /api/purchases: Unexpected error:', error);
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
});

module.exports = router;
