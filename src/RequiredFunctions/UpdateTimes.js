const Salons = require('../DbSchema/salons')


const ResetAllSlonTimeSlots = async () => {
    const today = new Date()
    try {

        const salons = await Salons.find({})

        for (let index = 0; index < salons.length; index++) {
            const timeslotArray = salons[index].generateTimeslots()
            salons[index].TimeSlotForBooking = timeslotArray
            await salons[index].save()
            // console.log(`salon ${index} updated`)
        }
        // console.log('All salons updated')
    } catch (error) {
        throw new Error({ error: "NO salons updated" })
    }
}
const TakeOrderBasedOnCurrentTime = (Time) => {
    const today = new Date()
    let arr = Time.split(":")

    arr.forEach(element => {
        element = parseInt(element)
    });
    let bookedTime = (arr[0] * 3600) + (arr[1] * 60)
    //For production :-> let currentTime = ((today.getHours() * 3600) + (today.getMinutes() * 60) + (today.getSeconds())) + 19905
    let currentTime = ((today.getHours() * 3600) + (today.getMinutes() * 60) + (today.getSeconds()))

    if (bookedTime <= currentTime) {
        return false
    } else {
        return true
    }


}

module.exports.ResetAllSlonTimeSlots = ResetAllSlonTimeSlots
module.exports.TakeOrderTakeOrderBasedOnCurrentTime = TakeOrderBasedOnCurrentTime