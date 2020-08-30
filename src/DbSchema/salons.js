// const mongoose = require('mongoose');
// const validator = require('validator')


//const salonSchema = new mongoose.Schema()
// const Salons = mongoose.model('Salon',)

//module.exports = Salons
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
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
        unique: true
        // min: 10,
        // max: 11
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Dont include "pasword" ')
            }
        }
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

    },
    stateName: {
        type: String,
        required: true
    },
    cityName: {
        type: String,
        required: true
    }


})

salonSchema.statics.findBYCredentials = async (mobileNo, password) => {

    const salon = await Salons.findOne({ mobileNo })
    console.log(salon)
    if (!salon) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, salon.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return salon

}

salonSchema.pre('save', async function (next) {

    const salon = this

    if (salon.isModified('password')) {
        salon.password = await bcrypt.hash(salon.password, 8)

    }

    next()

})
salonSchema.methods.generateTokenForSalon = async function () {

    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SALON)
    return token
}

const Salons = mongoose.model('Salon', salonSchema)

module.exports = Salons