const express = require('express')
const Order = require('../DbSchema/Orders')
const authObj = require('../Auth-middlewere/auth')
const router = new express.Router();
const Salons = require('../DbSchema/salons')
const RequiredFunctions = require('../RequiredFunctions/UpdateTimes')

router.post('/CreateOrder/BokingOf/ServicesNTimeslots/:id', authObj.auth, async (req, res) => {
    const today = new Date()
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
    if (date === req.body.bookingDate) {
        if (!RequiredFunctions.TakeOrderBasedOnCurrentTime(req.body.TimeSlotForBooking)) {
            return res.status(406).send("Sorry Booked Time is Elapsed")
        }
    }


    try {
        const salon = await Salons.findById(req.params.id)
        //console.log(salon)
        const servicesCount = req.body.services.length

        let indexOftimeslot = salon.TimeSlotForBooking.indexOf(req.body.TimeSlotForBooking)

        const bookedTimes = salon.TimeSlotForBooking.splice(indexOftimeslot, servicesCount)

        const order = new Order({
            servicesByUser: req.body.services,
            TimeSlotsForBooking: bookedTimes,
            completed: req.body.completed,
            owner: req.user._id,
            salonOwner: req.params.id,
            salonName: salon.salonName,
            salonOwnerName: salon.ownerName,
            salonOwnerMobileNo: salon.mobileNo,
            salontype: salon.salontype,
            bookingDate: req.body.bookingDate
        })
        await salon.save()


        await order.save()
        res.status(201).send(order)
    } catch (error) {
        res.status(401).send({ error: "Appointement Not booked" })

    }
})
// router.post('/CreateOrder/BokingOf/ServicesNTimeslots/:id', authObj.auth, async (req, res) => {
//     const todaysDate = new Date()
//     const bookedDate = req.body.bookedDate
//     const dateArr = req.body.bookedDate.split("/")
//     dateArr[0] = parseInt(dateArr[0])


//     try {
//         if (todaysDate.getDate() === dateArr[0]) {
//             if (!RequiredFunctions.TakeOrderBasedOnCurrentTime(req.body.BookingTimeSlot)) {
//                 return res.status(406).send("Sorry Booked Time is Elapsed")
//             }
//         }
//         const servicesCount = req.body.services.length
//         const bookedTimes = await RequiredFunctions.bookSlot(req.params.id, dateArr[0], servicesCount, req.body.BookingTimeSlot)
//         const order = new Order({
//             servicesByUser: req.body.services,
//             TimeSlotsForBooking: bookedTimes,
//             completed: req.body.completed,
//             owner: req.user._id,
//             salonOwner: req.params.id,
//             bookingDate: bookedDate
//         })
//         await order.save()
//         res.status(201).send(order)
//     } catch (error) {
//         res.status(401).send({ error: "Appointement Not booked" })

//     }
// })

router.get('/ActiveOrders/GetOrdersFromLoggedUser', authObj.auth, async (req, res) => {
    try {
        //const order = await Order.find({})
        const ActiveOrders = []
        await req.user.populate('myOrders').execPopulate();
        const AllOrdersArray = req.user.myOrders
        if (!AllOrdersArray) {
            return res.status(200).send('No Active Orders yet')
        }
        for (let index = 0; index < AllOrdersArray.length; index++) {
            if (AllOrdersArray[index].OrderStatus === 'PENDING') {
                ActiveOrders.push(AllOrdersArray[index])
            }
        }
        res.status(201).send(ActiveOrders)

    } catch (error) {
        res.status(400).send({ error: "Error fetching orders" })

    }
})
router.get('/CompletedOrders/GetOrdersFromLoggedUser', authObj.auth, async (req, res) => {
    try {
        //const order = await Order.find({})
        const CompletedOrders = []
        await req.user.populate('myOrders').execPopulate();
        const AllOrdersArray = req.user.myOrders
        if (!AllOrdersArray) {
            return res.status(200).send('No Completed Orders yet')
        }
        for (let index = 0; index < AllOrdersArray.length; index++) {
            //console.log(AllOrdersArray[index].OrderStatus)
            if (AllOrdersArray[index].OrderStatus === 'COMPLETED') {
                CompletedOrders.push(AllOrdersArray[index])
            }
        }
        res.status(200).send(CompletedOrders)

    } catch (error) {
        res.status(400).send({ error: "Error fetching orders" })

    }
})

router.get('/ShowOrdersFor/SalonOwner', authObj.authSalon, async (req, res) => {
    try {
        //const order = await Order.find({})
        var completedOrders = []
        const salonorders = await req.salon.populate('salonOrders').execPopulate()
        for (let index = 0; index < salonorders.salonOrders.length; index++) {
            //console.log(salonorders.salonOrders[index])
            if (salonorders.salonOrders[index].completed === false) {
                completedOrders.push(salonorders.salonOrders[index])
            }

        }
        //console.log(salonorders.salonOrders)

        res.status(201).send({ completedOrders })

    } catch (error) {
        res.status(400).send({ error: "Error fetching orders" })

    }
})
router.get('/GetSingleOrder/:id', authObj.auth, async (req, res) => {
    const _id = req.params.id
    try {
        const order = await Order.findOne({ _id, owner: req.user._id })
        if (!order) {
            return res.status(401).send()
        }
        res.send(order)
    } catch (error) {
        res.status(500).send({ error: 'Error while getting order' })

    }


})
router.patch('/UpdateOrder/:id', authObj.auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const order = await Order.findOne({ _id: req.params.id, owner: req.user._id })
        //console.log(order)
        if (!order) {
            return res.status(404).send(order)
        }
        updates.forEach((update) => order[update] = req.body[update])
        // console.log(order)
        await order.save()
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send({ error: 'Order not updated' })
    }
})
router.delete('/DeleteOrder/:id', authObj.auth, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!order) {
            res.status(404).send()
        }
        res.status(200).send(order)

    } catch (error) {
        res.status(400).send({ error: 'Order not deleted' })
    }

})
router.get('/GetTime', (req, res) => {
    const today = new Date()

    res.status(200).send({ Time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}` })



})

router.post('/Orders/ChangeStatus', async (req, res) => {
    try {
        const orders = await Order.find({ bookingDate: req.body.bookingDate })
        for (let index = 0; index < orders.length; index++) {

            orders[index].OrderStatus = 'COMPLETED'
            await orders[index].save()
            //console.log(`Order-${index} OrderStatus-${orders[index].OrderStatus} updated`)
        }

        res.status(201).send("OrderStatus of Orders of passed date Updated")
    } catch (error) {
        res.status(401).send("OrderStatus of Orders of passed date Not Updated")
    }
})

router.get('/GetTotalTime', (req, res) => {
    const today = new Date()
    const totalSec = ((today.getHours() * 3600) + (today.getMinutes() * 60) + (today.getSeconds())) - 19905
    res.status(200).send({ Time: totalSec })



})

module.exports = router