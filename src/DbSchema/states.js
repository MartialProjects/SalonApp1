const mongoose = require('mongoose');
const validator = require('validator')
const jwtState = require('jsonwebtoken')

const stateSchema = new mongoose.Schema({
    stateName: {
        type: String,
        required: true,
        unique: true
    },
    cityIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }]

})

stateSchema.methods.generateTokenForState = async function () {

    const token = jwtState.sign({ _id: this._id.toString() }, process.env.JWT_STATE)
    return token
}

const States = mongoose.model('State', stateSchema)

module.exports = States