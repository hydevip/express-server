# Project Description

## Overview

This project is a backend server application built with Node.js and Express. It is designed to handle HTTP requests, log activities, secure the application, and manage API rate limiting. The server also supports multi-core systems by utilizing clustering to run multiple instances.

## Requirements
 Node Js v20.9.0

## Project Structure

- **Root Directory**
  - [`index.js`](index.js): Main entry point that tests the express application.
  - [`package.json`](package.json): Contains project metadata and dependencies.
  - [`.env`](.env): Environment variables configuration file.
  - [`all-cities.json`](all-cities.json): JSON file containing city data.
  - [`README.md`](README.md): Project documentation.
  - [`jest.config.js`](jest.config.js): Configuration file for Jest testing framework.
  - [`coverage`](coverage): Directory containing code coverage reports.
  - [`__tests__`](__tests__): Directory containing test files.

- **server/**
  - [`index.js`](index.js): Initializes and configures the Express application.
  - `addresses.json`: JSON file containing address data.
  - `routes/`
    - `cities.js`: Defines routes related to city data.
  - `util/`
    - `util.js`: Utility functions used across the application.

## Key Features

- **Express Server**: Handles HTTP requests and responses.
- **Middleware**:
  - [`helmet`](node_modules/helmet/index.d.cts): Secures the app by setting various HTTP headers.
  - [`morgan`](/Users/paullungu/Library/Caches/typescript/5.6/node_modules/@types/morgan/index.d.ts): Logs HTTP requests.
  - [`express-rate-limit`](/Users/paullungu/Library/Caches/typescript/5.6/node_modules/@types/express/index.d.ts): Limits repeated requests to public APIs.
  - [`cors`](/Users/paullungu/Library/Caches/typescript/5.6/node_modules/@types/cors/index.d.ts): Enables Cross-Origin Resource Sharing.
- **Clustering**: Utilizes multiple CPU cores to improve performance.
- **Environment Configuration**: Uses [`.env`](.env) file for environment-specific settings.
- **Testing**: Configured with Jest and Supertest for unit and integration testing.

## Setup Instructions

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Run Tests**:

```sh
npm run test
```

3. **Start the Express Server**:

```sh
npm run start-express
```

4. **Build and Run the Docker Container**:

Build the Docker image: `docker build -t gan-integrity-backend .`
Run the Docker container: `docker run -p 8080:8080 gan-integrity-backend`


## Dependencies

- [`express`]: Web framework for Node.js.
- [`cors`]: Middleware for enabling CORS.
- `dotenv`: Loads environment variables from a [`.env`](.env) file.
- [`express-rate-limit`]: Middleware to limit repeated requests.
- [`express-validator`]: Middleware for validating and sanitizing requests.
- `fs-extra`: Provides additional file system methods.
- [`helmet`]: Helps secure Express apps by setting various HTTP headers.
- [`morgan`]: HTTP request logger middleware.
- `node-fetch`: A light-weight module that brings `window.fetch` to Node.js.

## DevDependencies

- `jest`: JavaScript testing framework.
- `supertest`: HTTP assertions made easy via superagent.

# GAN Integrity backend code challenge

The script `index.js` uses a local api to perform various operations on a set of cities. Your task is to implement an api so that the script runs successfully all the way to the end.

Run `npm install` and `npm run start` to start the script.

Your api can load the required data from [here](addresses.json).

In the distance calculations you can assume the earth is a perfect sphere and has a radius is 6371 km.

Once you are done, please provide us with a link to a git repo with your code, ready to run.
