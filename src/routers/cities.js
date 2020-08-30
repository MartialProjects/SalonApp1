const express = require('express')
const Cities = require('../DbSchema/cities')
const States = require('../DbSchema/states')
const authObj = require('../Auth-middlewere/auth')
const router = new express.Router();

router.post('/CreateCity', authObj.authState, async (req, res) => {
    const city = new Cities(req.body)
    // const _id = city._id
    // const cityIds = req.state.cityIds
    try {
        //console.log(city, state)

        //console.log(city)
        await city.save();
        const state = await States.findOne({ stateName: req.state.stateName })
        state.cityIds.push(city._id)

        await state.save()

        res.status(201).send({ city })
    } catch (error) {
        res.status(400).send({ error: 'City not created' })
    }
})
router.get('/GetAllCitiesFromState', authObj.authState, async (req, res) => {
    try {
        const state = await States.findOne({ stateName: req.state.stateName })
        // console.log(state)
        // console.log(state.populated('cityIds'))
        await state.populate('cityIds').execPopulate()
        //console.log(state.populated('cityIds'))
        // if (!city) {
        //     res.status(404).send('NOt found')
        // }
        res.status(200).send(state.cityIds)
    } catch (error) {
        res.status(401).send({ error: 'Error gettting all cities' })
    }
})
// router.post('/SelectCityByName', async (req, res) => {

//     try {
//         const city = await Cities.findOne({ cityName: req.body.cityName })
//         console.log(state)
//         const token = await city.generateTokenForCity()

//         if (!city) {
//             res.status(404).send('NOt found')
//         }
//         res.status(201).send({ city, token })
//     } catch (error) {
//         res.status(401).send({ error: 'Error selecting city' })
//     }
// })

router.patch('/UpdateCity/:id', authObj.authState, async (req, res) => {
    try {
        const city = await Cities.findByIdAndUpdate(req.params.id, { cityName: req.body.cityName })
        if (!city) {
            res.status(404).send('NOt Updated')
        }
        res.status(200).send(city)
    } catch (error) {
        res.status(401).send({ error: 'city not updated' })
    }
})

router.delete('/DeleteCity/:id', authObj.authState, async (req, res) => {
    try {
        const city = await Cities.findByIdAndDelete(req.params.id)

        //const state = await States.findById(req.state._id)
        // req.state.cityIds = req.state.cityIds.filter((_id) => {
        //     console.log(_id, city._id)
        //     console.log(_id == city._id)
        //     return _id == city._id
        // })
        const index = req.state.cityIds.indexOf(city._id)
        req.state.cityIds.splice(index, 1)

        await req.state.save()

        res.status(200).send(req.state)
    } catch (error) {
        res.status(401).send({ error: 'City not deleted' })
    }
})

router.delete('/DeleteAllCities', authObj.authState, async (req, res) => {
    try {
        // const cityIdsCount = req.state.cityIds.length
        // console.log(cityIdsCount)
        const city = await Cities.deleteMany()
        req.state.cityIds.splice(0, req.state.cityIds.length)

        await req.state.save()
        res.status(200).send(req.state)
    } catch (error) {
        res.status(401).send({ error: 'All Cities not deleted' })
    }
})


module.exports = router