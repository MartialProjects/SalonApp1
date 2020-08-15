const express = require('express')
const Order = require('../DbSchema/Orders')
const auth = require('../Auth-middlewere/auth')
const router = new express.Router();

router.post('/Orders', auth, async (req, res) => {
    //const order = new Order(req.body);
    const order = new Order({
        ...req.body,
        owner: req.user._id
    })

    try {
        await order.save()
        res.status(201).send(order)
    } catch (error) {
        res.status(400).send(error)

    }
})

router.get('/Orders', auth, async (req, res) => {
    try {
        //const order = await Order.find({})
        await req.user.populate('myOrders').execPopulate();

        res.status(201).send(req.user.myOrders)

    } catch (error) {
        res.status(400).send(error)

    }



})
router.get('/Orders/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const order = await Order.findOne({ _id, owner: req.user._id })
        if (!order) {
            return res.status(401).send()
        }
        res.send(order)
    } catch (error) {
        res.status(500).send(error)

    }


})
router.patch('/Orders/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const order = await Order.findOne({ _id: req.params.id, owner: req.user._id })
        console.log(order)
        if (!order) {
            return res.status(404).send(order)
        }
        updates.forEach((update) => order[update] = req.body[update])
        console.log(order)
        await order.save()
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/Orders/:id', auth, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!order) {
            res.status(404).send()
        }
        res.status(200).send(order)

    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router