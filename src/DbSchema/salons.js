// const mongoose = require('mongoose');
// const validator = require('validator')


//const salonSchema = new mongoose.Schema()
// const Salons = mongoose.model('Salon',)

//module.exports = Salons
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator')
//const jwt = require('jsonwebtoken');

var salonSchema = new Schema({
    salonName: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true,
        // min: 10,
        // max: 11
    },
    subLocation: {
        type: String
    },
    openingTime: {
        type: String,
        required: true
    },
    closingTime: {
        type: String,
        required: true
    },
    services: [{
        serviceName: String,
        price: Number,
        //required: true
    }],
    salontype: {
        type: String,
        enum: ['MALE', 'FEMALE', 'UNISEX'],
        required: true
    },
    description: {
        type: String

    }

})

const Salons = mongoose.model('Salon', salonSchema)

module.exports = Salons