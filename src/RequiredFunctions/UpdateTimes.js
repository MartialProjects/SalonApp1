const Salons = require('../DbSchema/salons')


const ResetAllSlonTimeSlots = async () => {

    try {
        //console.log("In resetTime")
        const salons = await Salons.find({})
        if (salons.length === 0) {
            return
        }

        for (let index = 0; index < salons.length; index++) {

            const timeslotArray = salons[index].generateTimeslots()
            salons[index].BookingTimeSlot.slot1 = salons[index].BookingTimeSlot.slot2
            salons[index].BookingTimeSlot.slot2 = salons[index].BookingTimeSlot.slot3
            salons[index].BookingTimeSlot.slot3 = timeslotArray
            await salons[index].save()
            //console.log(`salon ${index} updated`)
        }
        //console.log('All salons updated')
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
    let currentTime = ((today.getHours() * 3600) + (today.getMinutes() * 60) + (today.getSeconds())) + 19905

    //dev - let currentTime = ((today.getHours() * 3600) + (today.getMinutes() * 60) + (today.getSeconds()))

    if (bookedTime <= currentTime) {
        return false
    } else {
        return true
    }


}
const bookSlot = async (salonId, bookedDate, servicesCount, TimeSlot) => {
    //const salon = await Salons.findById(salonId)
    // //console.log(salonId, bookedDate, servicesCount, TimeSlot)
    const todaysDate = new Date()
    let currentDay = todaysDate.getDate()
    let bookedTimes = []
    const getNoOfDaysInMonth = new Date(todaysDate.getFullYear(), (todaysDate.getMonth() + 1), 0).getDate()

    if (getNoOfDaysInMonth === 31) {
        if (currentDay <= 29 && currentDay >= 1) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === (currentDay + 1)) {
                // console.log('line 76', servicesCount, TimeSlot)
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === (currentDay + 2)) {
                // console.log('line 80', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)

            }
        } else if (currentDay === 30) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 31) {
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 1) {
                // //console.log('line 92', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)

            }

        } else if (currentDay === 31) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 1) {
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 2) {
                // //console.log('line 105', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)


            }

        }
    } else if (getNoOfDaysInMonth === 28) {
        if (currentDay <= 26 && currentDay >= 1) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === (currentDay + 1)) {
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === (currentDay + 2)) {
                // //console.log('line 121', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)


            }
        } else if (currentDay === 27) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 28) {
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 1) {
                // console.log('line 134', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)


            }

        } else if (currentDay === 28) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 1) {
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 2) {
                // console.log('line 148', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)


            }

        }
    } if (getNoOfDaysInMonth === 30) {
        if (currentDay <= 28 && currentDay >= 1) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === (currentDay + 1)) {
                // //console.log(bookedDate)
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === (currentDay + 2)) {
                // console.log('line 165', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)

            }
        } else if (currentDay === 29) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 30) {
                bookedTimes = booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 1) {
                // console.log('line 177', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)

            }

        } else if (currentDay === 30) {
            if (bookedDate === currentDay) {
                bookedTimes = await booktodaySlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 1) {
                bookedTimes = await booktomorrowSlots(salonId, servicesCount, TimeSlot)

            } else if (bookedDate === 2) {
                // console.log('line 190', servicesCount, TimeSlot)
                bookedTimes = await bookdayAfterTomorrowSlots(salonId, servicesCount, TimeSlot)


            }

        }
    }
    return bookedTimes
}
const booktodaySlots = async function (salonId, servicesCount, TimeSlot) {
    const salon = await Salons.findById(salonId)
    let indexOftimeslot = salon.BookingTimeSlot.slot1.indexOf(TimeSlot)
    let bookedTimes = salon.BookingTimeSlot.slot1.splice(indexOftimeslot, servicesCount)
    await salon.save()
    return bookedTimes
}

const booktomorrowSlots = async function (salonId, servicesCount, TimeSlot) {
    const salon = await Salons.findById(salonId)
    let indexOftimeslot = salon.BookingTimeSlot.slot2.indexOf(TimeSlot)
    let bookedTimes = salon.BookingTimeSlot.slot2.splice(indexOftimeslot, servicesCount)
    await salon.save()
    return bookedTimes
}

const bookdayAfterTomorrowSlots = async function (salonId, servicesCount, TimeSlot) {
    const salon = await Salons.findById(salonId)
    let indexOftimeslot = salon.BookingTimeSlot.slot3.indexOf(TimeSlot)
    let bookedTimes = salon.BookingTimeSlot.slot3.splice(indexOftimeslot, servicesCount)
    await salon.save()
    return bookedTimes
}

module.exports.ResetAllSlonTimeSlots = ResetAllSlonTimeSlots
module.exports.TakeOrderBasedOnCurrentTime = TakeOrderBasedOnCurrentTime
module.exports.bookSlot = bookSlot