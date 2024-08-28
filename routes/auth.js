const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/order');
const { auth, admin } = require('./../middleware/auth');

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = new User({ name, username, password });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'SECRET_KEY');
        res.send({ token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'SECRET_KEY');
        res.send({ token });
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/isLoggedIn', auth, (req, res) => {
    res.json({ loggedIn: true, role: req.userRole });
});

router.get('/profile', auth, async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const orders = await Order.find({ userId });

        res.json({ success: true, user: { ...user.toObject(), orders } });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.put('/updateProfile', auth, async (req, res) => {
    const { name, username } = req.body;
    const userId = req.userId;

    try {
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (username) updatedFields.username = username;

        const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
