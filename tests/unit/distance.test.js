const dist = require('./distance');

test('calculates distance between two points', () => {
    expect(dist(53.32055555555556, 53.31861111111111, -1.7297222222222221, -1.6997222222222223)).toBe(2.004367838);
});

test('calculates distance between the same point', () => {
    expect(dist(53.32055555555556, 53.32055555555556, 53.31861111111111, 53.31861111111111)).toBe(0);
});