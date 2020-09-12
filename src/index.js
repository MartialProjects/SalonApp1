const express = require('express');
const userRouter = require('./routers/user');
const orderRouter = require('./routers/orders')
const cityRouter = require('./routers/cities');
const stateRouter = require('./routers/states')
const salonRouter = require('./routers/salons')
const RequiredFunctionObj = require('./RequiredFunctions/UpdateTimes')

require('./db/mongoose');
const app = express()
const port = process.env.PORT;


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin");
    next()
})
//For maintainenece activity if wont site to down

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down due to maintainance')
// })

/*Router Registration*/
app.use(express.json())
app.use(userRouter)
app.use(orderRouter)
app.use(stateRouter)
app.use(cityRouter)
app.use(salonRouter)



setInterval(() => {
    const today = new Date()
    //console.log(today.getHours())
    if (today.getHours() == 23) {
        RequiredFunctionObj.ResetAllSlonTimeSlots()
    }
}, 1200000)

// setInterval(RequiredFunctions.ResetAllSlonTimeSlots, 1000)




app.listen(port, () => {
    console.log('Server listen on ' + port)
})

// const User = require('./DbSchema/user')
// const Order = require('./DbSchema/Orders')


/*This is below just example function to show ho we can access
 order from user and user from orders
*/
// const main = async () => {
//     const order = await Order.findById('5f423fb92d0030079cbab665')
//     await order.populate('owner').execPopulate()
//     console.log(order.owner)

//     // const user = await User.findById('5f3790c7d12e302f907a77c4')
//     // await user.populate('myOrders').execPopulate()
//     // console.log(user.myOrders)
// }
// main()