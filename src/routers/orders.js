const express = require('express')
const Order = require('../DbSchema/Orders')
const authObj = require('../Auth-middlewere/auth')
const router = new express.Router();
const Salons = require('../DbSchema/salons')
const RequiredFunctions = require('../RequiredFunctions/UpdateTimes')


router.post('/CreateOrder/BokingOf/ServicesNTimeslots/:id', authObj.auth, async (req, res) => {
    if (!RequiredFunctions.TakeOrderTakeOrderBasedOnCurrentTime(req.body.TimeSlotForBooking)) {
        return res.status(406).send("Sorry Booked Time is Elapsed")
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
            salonOwner: req.params.id
        })


        await salon.save()


        await order.save()
        res.status(201).send(order)
    } catch (error) {
        res.status(401).send({ error: "Appointement Not booked" })

    }
})

router.get('/GetOrdersFromLoggedUser', authObj.auth, async (req, res) => {
    try {
        //const order = await Order.find({})
        await req.user.populate('myOrders').execPopulate();

        res.status(201).send(req.user.myOrders)

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

router.get('/GetTimes', (req, res) => {
    const today = new Date()

    const hrs = today.getHours()

    res.status(200).send({ hrs })



})

module.exports = router