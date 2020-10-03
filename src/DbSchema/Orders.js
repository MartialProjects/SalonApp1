const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    servicesByUser: [{
        serviceName: String,
        price: Number

    }],
    OrderStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
    },
    TimeSlotsForBooking: [{
        type: String
    }],
    creationDate: {
        type: Date,
        default: Date.now
    },
    bookingDate: {
        type: String
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
    },
    salonName: {
        type: String,
        required: true,
    },
    salonOwnerName: {
        type: String,
        required: true,
    },
    salonOwnerMobileNo: {
        type: Number
    },
    salontype: {
        type: String,
        required: true
    },
})
// }, {
//     timestamps: true
// })
const Order = mongoose.model('Order', orderSchema)

module.exports = Order