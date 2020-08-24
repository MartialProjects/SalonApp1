const express = require('express')
const User = require('../DbSchema/user')
const router = new express.Router();
const authObj = require('../Auth-middlewere/auth')

router.post('/CreateUser', async (req, res) => {
    const user = new User(req.body);
    //console.log(user._id)

    try {
        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })

    } catch (error) {
        res.status(400).send({ error: 'User Not created' })

    }

})

router.post('/User/login', async (req, res) => {
    try {
        //console.log(req.body.emailId, req.body.password)
        const user = await User.findBYCredentials(req.body.emailId, req.body.password)
        const token = await user.generateAuthToken()
        //console.log(user)

        if (!user) {
            res.status(404).send()
        }
        res.status(200).send({ user, token })

    } catch (error) {
        res.status(400).send({ error: 'Invalid Login details' })
    }
})

router.get('/GetLoggedUserData/me', authObj.auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.post('/User/logoutFromOneDevice', authObj.auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log(token.token)
            console.log(req.token)
            return token.token !== req.token
        })

        await req.user.save()
        res.status(200).send('Logged out')
    } catch (error) {
        res.status(400).send({ error: 'Not looged out' })
    }
})

router.post('/User/logOutFromAllDevices', authObj.auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Logged out of all')
    } catch (error) {
        res.status(400).send({ error: 'Not looged out' })
    }
})
// router.get('/User', async (req, res) => {
//     console.log(req.user)
//     try {

//         const user = await User.find({})

//         res.status(201).send(user)
//     } catch (error) {
//         res.status(500).send(error)

//     }
// })
router.get('/GetUserById/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send({ error: 'User not found' })

    }


})

router.patch('/UpdateUser/me', authObj.auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'emailId', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()


        res.send(req.user)

    } catch (error) {
        res.status(400).send({ error: 'User not updated' })
    }
})
router.delete('/DeleteUserAndOrders/me', authObj.auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     res.status(404).send()
        // }
        await req.user.remove()
        res.status(200).send(req.user)

    } catch (error) {
        res.status(400).send({ error: 'Not delted' })
    }

})

module.exports = router