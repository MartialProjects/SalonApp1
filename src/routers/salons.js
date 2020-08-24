const express = require('express')
const Cities = require('../DbSchema/cities')
const Salons = require('../DbSchema/salons')
const authObj = require('../Auth-middlewere/auth')
const router = new express.Router();


router.post('/CreateSalon', authObj.authCity, async (req, res) => {
    const salon = new Salons(req.body)
    try {
        await salon.save()
        const city = await Cities.findOne({ cityName: req.city.cityName })
        console.log(city)
        city.salonIds.push(salon._id)
        await city.save()
        res.status(200).send({ salon, city })

    } catch (error) {
        res.status(400).send({ error: 'Salon not created' })
    }
})
router.get('/GetAllSalonsFromCity', authObj.authCity, async (req, res) => {
    try {
        const city = await Cities.findOne({ cityName: req.city.cityName })
        // console.log(city)
        // console.log(city.populated('salonIds'))
        await city.populate('salonIds').execPopulate()
        //console.log(city.populated('salonIds'))
        // if (!city) {
        //     res.status(404).send('NOt found')
        // }
        res.status(200).send(city.salonIds)
    } catch (error) {
        res.status(401).send({ error: 'Error grtting all cities' })
    }
})
router.patch('/UpdateSalon/:id', authObj.authCity, async (req, res) => {
    try {
        await Salons.findByIdAndUpdate(req.params.id, {
            salonName: req.body.salonName,
            ownerName: req.body.ownerName,
            mobileNo: req.body.mobileNo,
            subLocation: req.body.subLocation,
            openingTime: req.body.openingTime,
            closingTime: req.body.closingTime,
            services: req.body.services,
            salontype: req.body.salontype,
            description: req.body.description
        })
        const salon = await Salons.findById(req.params.id)
        if (!salon) {
            res.status(404).send('NOt Updated')
        }
        res.status(200).send(salon)
    } catch (error) {
        res.status(401).send({ error: 'Salon not updated' })
    }
    // const updates = Object.keys(req.body)
    // // const allowedUpdates = ['salonName', 'ownerName', 'mobileNo', 'subLocation', 'openingTime', 'closingTime', 'services', 'salontype', 'description']
    // // const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    // // if (!isValidOperation) {
    // //     return res.status(400).send({ error: 'Invalid updates' })
    // // }
    // try {
    //     const salon = await Salons.findOne({ _id: req.params.id })
    //     console.log(salon)
    //     if (!salon) {
    //         return res.status(404).send(order)
    //     }
    //     updates.forEach((update) => salon[update] = req.body[update])
    //     console.log(salon)
    //     await salon.save()
    //     res.status(200).send(salon)
    // } catch (error) {
    //     res.status(400).send(error)
    // }
})
router.delete('/DeleteSalon/:id', authObj.authCity, async (req, res) => {
    try {
        const salon = await Salons.findByIdAndDelete(req.params.id)

        const index = req.city.salonIds.indexOf(salon._id)
        req.city.salonIds.splice(index, 1)

        await req.city.save()
        const city = req.city
        res.status(200).send({ city, salon })
    } catch (error) {
        res.status(401).send({ error: 'salon not deleted' })
    }
})

router.delete('/DeleteAllsalons', authObj.authCity, async (req, res) => {
    try {
        // const cityIdsCount = req.state.cityIds.length
        // console.log(cityIdsCount)
        const salon = await Salons.deleteMany()
        req.city.salonIds.splice(0, req.city.salonIds.length)
        const city = req.city
        await req.city.save()
        res.status(200).send({ salon, city })
    } catch (error) {
        res.status(401).send({ error: 'Salons not deleted' })
    }
})


module.exports = router