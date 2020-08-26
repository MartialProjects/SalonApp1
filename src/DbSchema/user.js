const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Order = require('./Orders')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobileNo: {
        type: Number,
        unique: true,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }

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
    age: {
        type: Number,
        required: true,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive')
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }


})
userSchema.virtual('myOrders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar //this deletes sending image response every time
    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismyuser');

    user.tokens = user.tokens.concat({ token })

    await user.save();

    return token


}
userSchema.statics.findBYCredentials = async (emailId, password) => {

    const user = await User.findOne({ emailId })
    console.log(user)
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user

}
userSchema.pre('save', async function (next) {

    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)

    }

    next()

})

userSchema.pre('remove', async function (next) {
    const user = this
    await Order.deleteMany({ owner: user._id })
    next()

})
const User = mongoose.model('User', userSchema)

module.exports = User