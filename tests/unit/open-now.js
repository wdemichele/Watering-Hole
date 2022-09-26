// JavaScript program to calculate Distance Between
// Two Points on Earth
function open_now(open_hours, current_time) {
    let WEEK = {
        "0": "January 2 2000",
        "1": "January 3 2000",
        "2": "January 4 2000",
        "3": "January 5 2000",
        "4": "January 6 2000",
        "5": "January 7 2000",
        "6": "January 8 2000",
    }

    const today = new Date(current_time)

    let day = today.getDay();
    if (day == 6 || day == 5 || day == 0) {
        if (day != 0) {
            WEEK["0"] = "January 9 2000";
        }
        WEEK["1"] = "January 10 2000";
        WEEK["2"] = "January 11 2000";
    }

    let minutes = today.getMinutes();
    let hour = today.getHours();
    hour = ('0000' + (hour * 100 + minutes)).slice(-4);

    let time = hour.slice(0, 2) + ":" + hour.slice(2);

    let currentDate = new Date(WEEK[day] + " " + time)
    let startDate;
    let endDate;

    for (let element of open_hours) {

        // console.log(element)
        startDate = new Date(WEEK[element.open.day] + " " + element.open.time.slice(0, 2) + ":" + element.open.time.slice(2));
        endDate = new Date(WEEK[element.close.day] + " " + element.close.time.slice(0, 2) + ":" + element.close.time.slice(2));
        console.log(startDate, currentDate, endDate)

        if (startDate < currentDate && endDate > currentDate) {
            return true
        }
    }

    return false

}

module.exports = open_now;