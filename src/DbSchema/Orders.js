const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    servicesByUser: [{
        serviceName: String,
        servicePrice: Number,
        completed: Boolean
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})
const Order = mongoose.model('Order', orderSchema)

module.exports = Order