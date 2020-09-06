const express = require('express')
//const Cities = require('../DbSchema/cities')
const Salons = require('../DbSchema/salons')
const multer = require('multer')
const sharp = require('sharp')
const authObj = require('../Auth-middlewere/auth')
const router = new express.Router();

//Image uploading for salons services
const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 4000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload image file'))
        }
        cb(undefined, true)
    }

})
router.post('/Salon/UploadImage', authObj.authSalon, upload.single('SalonImage'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.salon.shopImage = buffer
    await req.salon.save()
    res.send('File uploaded')

}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})

router.post('/CreateSalon', async (req, res) => {
    const salon = new Salons(req.body)
    try {
        await salon.save()
        // const city = await Cities.findOne({ cityName: req.city.cityName })
        // console.log(city)
        // city.salonIds.push(salon._id)
        // await city.save()
        const token = await salon.generateTokenForSalon()
        res.status(200).send({ salon, token })

    } catch (error) {
        res.status(400).send({ error: 'Salon not created' })
    }
})

router.post('/SalonOwner/Login', async (req, res) => {
    try {
        //console.log(req.body.emailId, req.body.password)
        const salon = await Salons.findSalonBYCredentials(req.body.mobileNo, req.body.password)

        const token = await salon.generateTokenForSalon()


        if (!salon) {
            res.status(404).send()
        }
        res.status(200).send({ salon, token })

    } catch (error) {
        res.status(400).send({ error: 'Invalid Login details' })
    }

})
router.post('/Salon/ForgotPassword', async (req, res) => {
    try {
        const salon = await Salons.findOne({ mobileNo: req.body.mobileNo })

        if (!salon) {
            res.status(404).send('Not found')

        }
        res.status(201).send(salon)

    } catch (error) {
        res.status(401).send({ error: 'User not found' })
    }
})
router.patch('/Salon/UpdatePassword', async (req, res) => {
    try {
        const salon = await Salons.findOne({ mobileNo: req.body.mobileNo })

        if (!salon) {
            res.status(404).send('Not found')

        }
        salon.password = req.body.password
        await salon.save()
        res.status(201).send('Password Updated succesfully')

    } catch (error) {
        res.status(401).send({ error: 'Password not updated' })
    }
})

router.post('/GetAllSalonfrom/SelectedStateNCity', async (req, res) => {
    try {
        const salon = await Salons.find({ stateName: req.body.stateName, cityName: req.body.cityName })
        if (!salon) {
            res.status(404).send("Not found any salons")
        }
        res.status(200).send(salon)
    } catch (error) {
        res.status(401).send({ error: 'No data found' })
    }
})

router.get('/GetAllSalons', async (req, res) => {
    try {
        const salon = await Salons.find({})

        // for(var i=0; i<salon.length;i++)
        // {
        //     salon[i]
        // }

        if (!salon) {
            res.status(404).send("Not found any salons")
        }
        //res.set('Content-Type', 'image/png')
        res.status(200).send(salon)
    } catch (error) {
        res.status(401).send({ error: 'No data found' })
    }
})



router.get('/SelectSalonById/:id', async (req, res) => {
    try {
        const salon = await Salons.findById(req.params.id)
        if (!salon) {
            res.status(404).send("No any salons")
        }
        res.status(200).send(salon)

    } catch (error) {
        res.status(401).send({ error: 'No salons found' })
    }
})
// router.get('/GetAllSalonsFromCity', authObj.authCity, async (req, res) => {
//     try {
//         const city = await Cities.findOne({ cityName: req.city.cityName })
//         // console.log(city)
//         // console.log(city.populated('salonIds'))
//         await city.populate('salonIds').execPopulate()
//         //console.log(city.populated('salonIds'))
//         // if (!city) {
//         //     res.status(404).send('NOt found')
//         // }
//         res.status(200).send(city.salonIds)
//     } catch (error) {
//         res.status(401).send({ error: 'Error grtting all cities' })
//     }
// })


router.patch('/LoggedSalonOwner/UpdateSalon', authObj.authSalon, async (req, res) => {
    // try {
    //     const salon = await Salons.findByIdAndUpdate(req.salon._id, {
    //         salonName: req.body.salonName,
    //         ownerName: req.body.ownerName,
    //         mobileNo: req.body.mobileNo,
    //         password: req.body.password,
    //         subLocation: req.body.subLocation,
    //         openingTime: req.body.openingTime,
    //         closingTime: req.body.closingTime,
    //         services: req.body.services,
    //         salontype: req.body.salontype,
    //         description: req.body.description,
    //         stateName: req.body.stateName,
    //         cityName: req.body.cityName
    //     })

    //     if (!salon) {
    //         res.status(404).send('Not Updated')
    //     }
    //     res.status(200).send(salon)
    // } catch (error) {
    //     res.status(401).send({ error: 'Salon not updated' })
    // }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['salonName', 'ownerName', 'mobileNo', 'password', 'subLocation', 'openingTime', 'closingTime', 'services', 'salontype', 'description', 'cityName', 'stateName']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const salon = await Salons.findOne({ _id: req.salon._id })
        console.log(salon)
        if (!salon) {
            return res.status(404).send(order)
        }
        updates.forEach((update) => salon[update] = req.body[update])
        console.log(salon)
        await salon.save()
        res.status(200).send(salon)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/DeleteLoggedSalon/me', authObj.authSalon, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     res.status(404).send()
        // }
        await req.salon.remove()
        res.status(200).send(req.salon)

    } catch (error) {
        res.status(400).send({ error: 'Not delted' })
    }

})

//Below service is for ADMIN
router.delete('/DeleteSalon/:id', async (req, res) => {
    try {
        const salon = await Salons.findByIdAndDelete(req.params.id)

        // const index = req.city.salonIds.indexOf(salon._id)
        // req.city.salonIds.splice(index, 1)

        // await req.city.save()
        // const city = req.city
        res.status(200).send(salon)
    } catch (error) {
        res.status(401).send({ error: 'salon not deleted' })
    }
})

router.post('/Salon/logoutFromOneDevice', authObj.authSalon, async (req, res) => {
    try {
        req.salon.tokens = req.salon.tokens.filter((token) => {
            //console.log(token.token)
            //console.log(req.token)
            return token.token !== req.token
        })

        await req.salon.save()
        res.status(200).send('Logged out')
    } catch (error) {
        res.status(400).send({ error: 'Not looged out' })
    }
})

router.post('/Salon/logOutFromAllDevices', authObj.authSalon, async (req, res) => {
    try {
        req.salon.tokens = []
        await req.salon.save()
        res.status(200).send('Logged out of all')
    } catch (error) {
        res.status(400).send({ error: 'Not looged out' })
    }
})

router.delete('/DeleteAllsalons', async (req, res) => {
    try {
        // const cityIdsCount = req.state.cityIds.length
        // console.log(cityIdsCount)
        const salon = await Salons.deleteMany()
        // req.city.salonIds.splice(0, req.city.salonIds.length)
        // const city = req.city
        // await req.city.save()
        res.status(200).send(salon)
    } catch (error) {
        res.status(401).send({ error: 'Salons not deleted' })
    }
})

router.get('/GetSalonPhoto', authObj.authSalon, async (req, res) => {
    //  req.accepts(['json', 'png'])
    try {
        const salon = req.salon

        //const picture = await Pictures.findById(user._id)

        if (!salon || !salon.shopImage) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.status(200).send(salon.shopImage)
        // res
        //     .contentType("image/png", "application/json")
        //     .send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.delete('/Salon/me/deleteShopImage', authObj.authSalon, async (req, res) => {
    req.salon.shopImage = undefined
    await req.salon.save()
    res.status(200).send('Deleted')
})


module.exports = router