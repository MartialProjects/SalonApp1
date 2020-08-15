const jwt = require('jsonwebtoken')
const User = require('../DbSchema/user')

const auth = async (req, res, next) => {
    try {
        //console.log(req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismyuser')
        // console.log(decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error();
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

module.exports = auth