const request = require('supertest');
const express = require('express');
const citiesRouter = require('../server/routes/cities');
const { checkAuth, calculateDistance } = require('../server/util/util');

jest.mock('../server/util/util', () => ({
    checkAuth: (req, res, next) => next(),
    calculateDistance: () => 10
}));



const app = express();
app.use(express.json());
app.use('/', citiesRouter);

describe('Cities Routes  ', () => {
    test('GET /cities-by-tag - success', async () => {
        const response = await request(app)
            .get('/cities-by-tag')
            .query({ tag: 'excepteurus', isActive: 'true' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('cities');
    });

    test('GET /cities-by-tag - validation error', async () => {
        const response = await request(app)
            .get('/cities-by-tag')
            .query({ tag: '', isActive: '00' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    test('GET /distance - success', async () => {
        const response = await request(app)
            .get('/distance')
            .query({ from: 'ed354fef-31d3-44a9-b92f-4a3bd7eb0408', to: '17f4ceee-8270-4119-87c0-9c1ef946695e' });

        expect(response.status).toBe(200);
    });
});