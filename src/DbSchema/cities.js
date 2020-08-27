const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');

const citySchema = new mongoose.Schema({
    cityName: {
        type: String,
        unique: true,
        required: true

    },
    salonIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon'
    }]
})

citySchema.methods.generateTokenForCity = async function () {

    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_CITY)
    return token
}


const Cities = mongoose.model('City', citySchema)

module.exports = Cities