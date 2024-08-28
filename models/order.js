const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productImg: { type: String, requred: true },
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    productCost: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
