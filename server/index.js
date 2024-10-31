const express = require('express');

const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const citiesRouter = require('./routes/cities');

const cluster = require('cluster');
const os = require('os');

// we can take advantage of multi-core systems by running multiple instances of our server
if (false) {
    //if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        //this might cause some issues as each worker process runs in its own memory space 
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {

    const app = express();
    const PORT = process.env.PORT || 8080;


    const apiRateLimit = rateLimit({
        windowMs: 1 * 60 * 1000, // these values can be hardcoded in the .env file
        max: 100 // Limit each IP to 100 requests per `window` (1 minute)
    });


    //////////////////////// MIDDLEWARES ////////////////////////

    app.use(helmet()); //We add the helmet middleware to secure the app. We go with the default configuration
    app.use(morgan('combined')); //We add the morgan middleware to log minimum info about requests
    app.use(apiRateLimit); // We add the API Rate Limiter middleware
    app.use(cors({ origin: '*' })); // We add the CORS middleware to allow all origins, but this can be configured to allow only specific origins

    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

    //////////////////////// ROUTES ////////////////////////

    app.use('/', citiesRouter);

    //////////////////////// ERROR HANDLING ////////////////////////

    app.use((req, res, next) => {
        // Catch-all route for 404 Not Found
        res.status(404).json({ message: "Resource not found" });
    });

    app.use((err, req, res, next) => {
        // Centralized Error Handler Middleware
        console.error(err.stack);
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    });
  
    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
}