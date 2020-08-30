const jwt = require('jsonwebtoken')
const User = require('../DbSchema/user')
const States = require('../DbSchema/states')
//const Cities = require('../DbSchema/cities')
const Salons = require('../DbSchema/salons')

const auth = async (req, res, next) => {
    try {
        //console.log(req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, process.env.JWT_USER)
        // console.log(decoded)
        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

        if (!user) {
            throw new Error({ error: 'Inavlid authentication' });
        }

        req.token = token
        req.user = user
        // console.log('In authjs')
        // console.log(req.user)
        next()
    } catch (error) {
        res.status(400).send({ error: 'Inavlid authentication' })
    }

}
const authState = async (req, res, next) => {
    try {
        const stateToken = req.header('Authorization').replace('Bearer ', '');
        const decodedStateToken = jwt.verify(stateToken, process.env.JWT_STATE);
        const state = await States.findOne({ _id: decodedStateToken._id })
        if (!state) {
            throw new Error({ error: 'Invalid authentication for state' });
        }
        req.token = stateToken;
        req.state = state
        next()
    } catch (error) {
        res.status(400).send({ error: 'Invalid authentication for state' })
    }
}
const authSalon = async (req, res, next) => {

    try {
        const salonToken = req.header('Authorization').replace('Bearer ', '');
        const decodedSalonToken = jwt.verify(salonToken, process.env.JWT_SALON);
        const salon = await Salons.findOne({ _id: decodedSalonToken._id, 'tokens.token': salonToken })
        console.log(salon)
        if (!salon) {
            throw new Error({ error: 'Invalid authentication for salon' });
        }
        // console.log(salon)
        req.token = salonToken;
        req.salon = salon
        next()
    } catch (error) {
        res.status(400).send({ error: 'Invalid authentication for salon' })
    }
}
// const authCity = async (req, res, next) => {

//     try {
//         const cityToken = req.header('Authorization').replace('Bearer ', '');
//         const decodedCityToken = jwt.verify(cityToken, process.env.JWT_CITY);
//         const city = await Cities.findOne({ _id: decodedCityToken._id })
//         console.log(city)
//         if (!city) {
//             throw new Error({ error: 'Invalid authentication for city' });
//         }
//         console.log(city)
//         req.token = cityToken;
//         req.city = city
//         next()
//     } catch (error) {
//         res.status(400).send({ error: 'Invalid authentication for city' })
//     }
// }

module.exports.auth = auth
module.exports.authState = authState
module.exports.authSalon = authSalon
//module.exports.authCity = authCity