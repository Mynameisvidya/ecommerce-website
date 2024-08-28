const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const { auth } = require('../middleware/auth');

// Create a new order
router.post('/orders', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product || product.stock < quantity) {
            return res.status(400).send({ message: 'Product not available or insufficient stock' });
        }

        const order = new Order({
            userId: req.userId,
            productId: productId,
            productImg: product.imgString,
            productName: product.name,
            productCategory: product.category,
            productCost: product.price,
            quantity: quantity
        });

        product.stock -= quantity;
        await product.save();
        await order.save();

        res.status(201).send(order);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get orders for a user
router.get('/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).populate('productId');
        res.status(200).send(orders);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
