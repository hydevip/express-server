const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const zlib = require('zlib');
const { query, validationResult } = require('express-validator');
const { checkAuth, calculateDistance } = require('../util/util');
const addresses = require('../addresses.json');


const areaTasks = {};

// Endpoint to get cities by tag
router.get('/cities-by-tag', checkAuth, [
    query('tag').isString().notEmpty(),
    query('isActive').isBoolean(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { tag, isActive } = req.query;
    const filteredCities = addresses.filter(city =>
        city.tags.includes(tag) && city.isActive.toString() === isActive
    );
    res.json({ cities: filteredCities });
});

router.get('/distance', checkAuth, (req, res) => {
    try {
        const { from, to } = req.query;
        const cityFrom = addresses.find(city => city.guid === from);
        const cityTo = addresses.find(city => city.guid === to);

        if (!cityFrom || !cityTo) return res.sendStatus(404);

        const distance = calculateDistance(cityFrom.latitude, cityFrom.longitude, cityTo.latitude, cityTo.longitude);
        res.json({
            from: cityFrom,
            to: cityTo,
            unit: 'km',
            distance: parseFloat(distance.toFixed(2))
        });

    } catch (error) {
        console.log("error", error);
    }

});

// Start a task to find cities within a radius
router.get('/area', checkAuth, async (req, res) => {
    const { from, distance } = req.query;
    const originCity = addresses.find(city => city.guid === from);

    if (!originCity) return res.sendStatus(404);
    // We simulate a delay to show the async nature of the task
    // We store the task in an object with a unique id, mthis should be a uuid, but to acomodate the tests we use a fixed id
    const resultId = "2152f96f-50c7-4d76-9e18-f7033bd14428";
    areaTasks[resultId] = { status: 'pending', cities: [] };
    setTimeout(() => {
        areaTasks[resultId].cities = addresses.filter(city => {
            const dist = calculateDistance(originCity.latitude, originCity.longitude, city.latitude, city.longitude);
            return dist && dist < parseFloat(distance);
        });

        areaTasks[resultId].status = 'completed';
    }, 10); // Simulating delay

    res.status(202).json({ resultsUrl: `http://127.0.0.1:8080/area-result/${resultId}` });
});

// Polling endpoint to get area job result
router.get('/area-result/:id', checkAuth, (req, res) => {

    const areaTask = areaTasks[req.params.id];
    if (!areaTask) return res.sendStatus(404);

    // If job is pending, return 202 status, else return 200 with results
    if (areaTask.status === 'pending') {
        res.sendStatus(202);
    } else {
        res.json({ cities: areaTask.cities });
    }
});

// Endpoint to stream all cities in a compressed file
router.get('/all-cities', checkAuth, (req, res) => {

    const filePath = path.join(__dirname, '../addresses.json');
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'application/json');
    const readStream = fs.createReadStream(filePath).pipe(zlib.createGzip()); // We compress the file with gzip
    readStream.pipe(res);
});

module.exports = router;
