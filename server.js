const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./routes');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Routes
app.use('/', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
})

app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/product.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/signup.html'));
});

app.get('/admin_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/admin_dashboard.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/profile.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
