const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');            

const router = express.Router();

//@route GET /api/orders/my-orders
//@desc Get all orders for the logged-in user
//@access Private
router.get('/my-orders', protect, async (req, res) => {
    try {
        //find order for the authenticated user
        const orders = await Order.find({ user: req.user._id }).sort({ 
            createdAt: -1 });//sort by most recent orders first
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//@route GET /api/orders/:id
//@desc Get order by ID for the logged-in user
//@access Private
router.get("/:id", protect, async (req, res) => {
    console.log("Order ID requested:", req.params.id);
    try{
        const order =await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )
    if(!order){
        return res.status(404).json({ message: 'Order not found' });
    }
    //return full order details
    res.json(order);
    
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
)


module.exports = router;
