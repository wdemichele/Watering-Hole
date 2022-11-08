const open_now = require('./open-now');




test('calculates open time for same day hours', () => {
    let open_hours = [
        { close: { day: 0, time: '2300' }, open: { day: 0, time: '1100' } },
        { close: { day: 1, time: '2300' }, open: { day: 1, time: '1100' } },
        { close: { day: 2, time: '2300' }, open: { day: 2, time: '1100' } },
        { close: { day: 3, time: '2300' }, open: { day: 3, time: '1100' } },
        { close: { day: 4, time: '2300' }, open: { day: 4, time: '1100' } },
        { close: { day: 5, time: '2300' }, open: { day: 5, time: '1100' } },
        { close: { day: 6, time: '2300' }, open: { day: 6, time: '1100' } }
    ]

    let current_time = "2022-09-26T04:00:00.000Z" // 2pm AEST
    expect(open_now(open_hours, current_time)).toBe(true);

    current_time = "2022-09-26T00:30:00.000Z" // 10:30am AEST
    expect(open_now(open_hours, current_time)).toBe(false);
});



test('calculates open time for different day hours', () => {
    let open_hours = [
        { close: { day: 1, time: '0100' }, open: { day: 0, time: '1100' } },
        { close: { day: 2, time: '0100' }, open: { day: 1, time: '1100' } },
        { close: { day: 3, time: '0100' }, open: { day: 2, time: '1100' } },
        { close: { day: 4, time: '0100' }, open: { day: 3, time: '1100' } },
        { close: { day: 5, time: '0100' }, open: { day: 4, time: '1100' } },
        { close: { day: 6, time: '0100' }, open: { day: 5, time: '1100' } },
        { close: { day: 0, time: '0100' }, open: { day: 6, time: '1100' } }
    ]

    let current_time = "2022-09-26T14:30:00.000Z" // 12:30am AEST
    expect(open_now(open_hours, current_time)).toBe(true);

    current_time = "2022-09-26T15:30:00.000Z" // 1:30am AEST
    expect(open_now(open_hours, current_time)).toBe(false);
});

test('calculates open time for 24 hour open', () => {
    let open_hours = [
        { close: { day: 3, time: '0100' }, open: { day: 2, time: '1700' } },
        { close: { day: 4, time: '0100' }, open: { day: 3, time: '1700' } },
        { close: { day: 5, time: '0600' }, open: { day: 4, time: '1700' } },
        { close: { day: 6, time: '1200' }, open: { day: 5, time: '1700' } },
        { close: { day: 1, time: '0600' }, open: { day: 6, time: '1700' } }
    ]

    let current_time = "2022-09-26T14:30:00.000Z" // 12:30am AEST
    d = new Date(current_time);
    console.log(d.toLocaleString());
    console.log(d.getDay());
    expect(open_now(open_hours, current_time)).toBe(false);

    current_time = "2022-09-26T15:30:00.000Z" // 1:30am AEST
    expect(open_now(open_hours, current_time)).toBe(false);
});