
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const RADIUS_EARTH_KM = 6371;

// We create a middleware to check if the request has the correct authorization token
function checkAuth(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token === AUTH_TOKEN) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// We calculate the distance with the help of Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = angle => (angle * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * RADIUS_EARTH_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = { checkAuth, calculateDistance };
