const express = require('express');
const router = express.Router();
const Product = require('./models/product');
const { auth, admin } = require('./middleware/auth');
const Review = require('./models/review');

router.post('/products', auth, admin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/searchItems', async (req, res) => {
    const searchKeywords = req.query.q ? req.query.q.toLowerCase() : '';
    
    try {
        const products = await Product.find({ name: { $regex: new RegExp(searchKeywords, "i")  } });
        res.status(200).send(products);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.put('/products/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/products/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/product/:id/review', auth, async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { rating, description } = req.body;
    try {
        const review = new Review({ productId: id, rating, description, user: userId });
        await review.save();

        const product = await Product.findById(id);
        if (product) {
            await product.updateAverageRating();
        }

        res.redirect(`/product/${id}`);
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).send("Error saving review");
    }
});

router.get('/product/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ productId: id }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Error fetching reviews");
    }
});

module.exports = router;
