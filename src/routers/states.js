const express = require('express')
const States = require('../DbSchema/states')
const authObj = require('../Auth-middlewere/auth')
const router = new express.Router();

router.post('/CreateState', async (req, res) => {
    const state = new States(req.body)
    try {
        await state.save();
        res.status(201).send(state)
    } catch (error) {
        res.status(400).send({ error: 'State not created' })
    }
})

router.get('/GetAllStates', async (req, res) => {
    try {
        const state = await States.find({})
        if (!state) {
            res.status(404).send('NOt found')
        }
        res.status(200).send(state)
    } catch (error) {
        res.status(401).send({ error: 'Error fethcing states' })
    }
})
router.post('/SelectStateByName', async (req, res) => {

    try {
        const state = await States.findOne({ stateName: req.body.stateName })
        // console.log(state)
        const token = await state.generateTokenForState()

        if (!state) {
            res.status(404).send('NOt found')
        }
        res.status(201).send({ state, token })
    } catch (error) {
        res.status(401).send({ error: 'Error selecting state' })
    }
})

router.patch('/UpdateState', authObj.authState, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["stateName"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send('Invalid updates')
    }
    try {
        updates.forEach((update) => req.state[update] = req.body[update])

        await req.state.save()
        res.status(201).send(req.state)
    } catch (error) {
        res.status(401).send({ error: 'State not Updated' })
    }

})

router.delete('/DeleteStateByName', authObj.authState, async (req, res) => {

    try {
        // console.log(req.state)
        const state = await req.state.remove()
        res.status(200).send({ state })
    } catch (error) {
        res.status(401).send({ error: 'State not Deleted' })
    }
})
router.delete('/States/deleteAll', async (req, res) => {

    try {
        await States.deleteMany();
        res.status(200).send('All states Deleted')
    } catch (error) {
        res.status(401).send({ error: 'All states not Deleted' })
    }
})


module.exports = router