// const mongoose = require('mongoose');
// const validator = require('validator')


//const salonSchema = new mongoose.Schema()
// const Salons = mongoose.model('Salon',)

//module.exports = Salons
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const salonSchema = new mongoose.Schema({
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
        unique: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Dont include "pasword" ')
            }
        }
    },
    shopImage: {
        type: Buffer
    },
    subLocation: {
        type: String
    },
    openingTime: {
        type: Number,
        required: true
    },
    closingTime: {
        type: Number,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    // BookingTimeSlot: {
    //     slot1: [{ type: String }],
    //     sLot2: [{ type: String }],
    //     slot3: [{ type: String }],
    // }
    TimeSlotForBooking: [{ type: String }]
})




salonSchema.virtual('salonOrders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'salonOwner'
})
salonSchema.methods.toJSON = function () {
    const salon = this

    const salonObject = salon.toObject()

    delete salonObject.password
    delete salonObject.tokens
    delete salonObject.shopImage //this deletes sending image response every time
    return salonObject
}
salonSchema.methods.generateTimeslots = function () {

    var openingTime = this.openingTime
    var closingTime = this.closingTime
    // console.log(openingTime, closingTime)
    // let hrs = ClosingTime - openingTime
    //let noOfSlots = Math.trunc(hrs / (3 / 4))

    const timeslotsArray = []
    timeslotsArray.push(`${openingTime}:${0}0`)
    var elementToPush
    let diff = 0
    while (openingTime !== closingTime) {
        if (diff === 0) {
            elementToPush = `${openingTime}:${45}`

            diff = 60 - 45
            timeslotsArray.push(elementToPush)
            openingTime++
        } else if (diff === 15) {
            elementToPush = `${openingTime}:${30}`

            diff = 60 - 30
            timeslotsArray.push(elementToPush)
            openingTime++
        }
        else if (diff === 30) {
            elementToPush = `${openingTime}:${15}`
            diff = 60 - 15
            timeslotsArray.push(elementToPush)
            openingTime++
        } else if (diff === 45) {
            elementToPush = `${openingTime}:${0}0`
            diff = 0
            timeslotsArray.push(elementToPush)
            //openingTime++
        }
    }



    // timeslotsArray.forEach(element => {
    //     console.log(element)
    // });
    return timeslotsArray
}

salonSchema.statics.findSalonBYCredentials = async (mobileNo, password) => {

    const salon = await Salons.findOne({ mobileNo })
    //console.log(salon)
    if (!salon) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, salon.password)
    // console.log(isMatch)
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
    const salon = this
    const token = jwt.sign({ _id: salon._id.toString() }, process.env.JWT_SALON)
    salon.tokens = salon.tokens.concat({ token })
    await salon.save()
    return token
}

const Salons = mongoose.model('Salon', salonSchema)

module.exports = Salons