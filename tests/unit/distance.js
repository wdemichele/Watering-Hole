const EARTH_RADIUS_KM = 6371

// JavaScript program to calculate Distance Between
// Two Points on Earth
function distance(lat1,
    lat2, lon1, lon2) {

    // convert to radians
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers.
    let r = EARTH_RADIUS_KM;

    // calculate the result
    let distance = Math.round(((c * r) + Number.EPSILON) * 1000000000) / 1000000000;
    return distance;
}

module.exports = distance;