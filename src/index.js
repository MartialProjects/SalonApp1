const express = require('express');
const userRouter = require('./routers/user');
const orderRouter = require('./routers/orders')
const cityRouter = require('./routers/cities');
const stateRouter = require('./routers/states')
const salonRouter = require('./routers/salons')
var schedule = require('node-schedule');
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




// setInterval(() => {
//     const today = new Date()
//     //console.log(today.getHours())
//     if (today.getHours() == 18) {
//         RequiredFunctionObj.ResetAllSlonTimeSlots()
//     }
// }, 900000)
const today = new Date()
var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 27, 0);

var j = schedule.scheduleJob(date, function () {
    RequiredFunctionObj.ResetAllSlonTimeSlots()
});




app.listen(port, () => {
    console.log('Server listen on ' + port)
})




