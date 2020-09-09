const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    servicesByUser: [{
        serviceName: String,
        price: Number

    }],
    completed: {
        type: Boolean,
        default: false
    },
    TimeSlotsForBooking: [{
        type: String
    }],
    creationDate: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    salonOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Salon'
    }
})
// }, {
//     timestamps: true
// })
const Order = mongoose.model('Order', orderSchema)

module.exports = Order