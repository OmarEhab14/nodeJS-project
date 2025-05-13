const mongoose = require('mongoose')
const app = require('../app')
const userModel = require('../models/user.model')
const request = require('supertest')

require('dotenv').config()
let token;
let csrfCookie;

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB)
    // Get CSRF token and cookie
    const res = await request(app).get('/test-token');
    token = res.body.csrfToken;
    csrfCookie = res.headers['set-cookie'][0];
})

afterAll(async () => {
    await userModel.deleteMany({ isTest: true });
    await mongoose.connection.close();
})

describe('navigate to login page', () => {
    it('should navigate to login page', async () => {
        const res = await request(app).get('/login');
        expect(res.status).toBe(200);
    })
})

describe('navigate to registration page', () => {
    it('should navigate to registration page', async () => {
        const res = await request(app).get('/register');
        expect(res.status).toBe(200);
    })
})

describe('navigation of admin and normal users', () => {
    let agent;
    beforeAll(async () => {
        agent = request.agent(app);
        const res = await agent.get('/test-token');
        token = res.body.csrfToken;
    })

    it('should navigate to discount manager page if the user is admin', async () => {
        const tokenRes = await agent.get('/test-token');
        const token = tokenRes.body.csrfToken;

        const registerRes = await agent
            .post('/register')
            .set('Cookie', tokenRes.headers['set-cookie'])
            .send({
                _csrf: token,
                firstName: "Admin",
                lastName: "Test",
                mobile: "01000000000",
                gender: "male",
                username: "adminUser",
                email: "admin@test.com",
                password: "password123",
                confirmPassword: "password123",
                isAdmin: true,
                isTest: true
            });

        expect(registerRes.status).toBe(302);

        const loginTokenRes = await agent.get('/test-token');
        const loginToken = loginTokenRes.body.csrfToken;

        const loginRes = await agent
            .post('/login')
            .set('Cookie', loginTokenRes.headers['set-cookie'])
            .send({
                _csrf: loginToken,
                email: "admin@test.com",
                password: "password123",
            });

        expect(loginRes.status).toBe(302);

        const homeRes = await agent.get('/home');
        expect(homeRes.header['location']).toBe('/discount');

        const discountRes = await agent.get('/discount');
        expect(discountRes.status).toBe(200);
    }),

        it('should navigate to the home page if the user is normal user', async () => {
            const tokenRes = await agent.get('/test-token');
            token = tokenRes.body.csrfToken;

            await agent
                .post('/register')
                .send({
                    _csrf: token,
                    firstName: "Normal",
                    lastName: "User",
                    mobile: "01000000000",
                    gender: "male",
                    username: "normalUser",
                    email: "normalUser@test.com",
                    password: "password123",
                    confirmPassword: "password123",
                    isAdmin: false,
                    isTest: true
                });

            const res = await agent.get('/discount');
            expect(res.header['location']).toBe('/home');
        }),

        it('should navigate normally to the home page', async () => {
            const res = await agent.get('/home');
            expect(res.status).toBe(200);
        }),

        it('should fail to load the products in the home page.', async () => {
            await mongoose.connection.close();
            const res = await agent.get('/home');
            expect(res.status).toBe(500);
            await mongoose.connect(process.env.connect_DB);
        }),

        it('should redirect to the login page if the user is logged out from the system', async () => {
            const tokenRes = await agent.get('/test-token');
            token = tokenRes.body.csrfToken;

            await agent.get('/logout');
            const res = await agent.get('/home');
            expect(res.header['location']).toBe('/login');
        })
});