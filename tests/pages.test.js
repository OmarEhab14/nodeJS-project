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
        // Get CSRF token and cookie for the agent
        const res = await agent.get('/test-token');
        token = res.body.csrfToken;
        // The cookie is automatically stored in the agent
    })

    it('should navigate to discount manager page if the user is admin', async () => {
        // Step 1: Establish session + get CSRF token from that session
        const tokenRes = await agent.get('/test-token');
        const token = tokenRes.body.csrfToken;

        // Step 2: Register using the same agent + CSRF token
        const registerRes = await agent
            .post('/register')
            .set('Cookie', tokenRes.headers['set-cookie']) // send cookies from /test-token
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

        // Step 3: Get new CSRF token (same session)
        const loginTokenRes = await agent.get('/test-token');
        const loginToken = loginTokenRes.body.csrfToken;

        // Step 4: Login
        const loginRes = await agent
            .post('/login')
            .set('Cookie', loginTokenRes.headers['set-cookie'])
            .send({
                _csrf: loginToken,
                email: "admin@test.com",
                password: "password123",
            });

        expect(loginRes.status).toBe(302);

        // Step 5: Navigate to /home
        const homeRes = await agent.get('/home');
        expect(homeRes.header['location']).toBe('/discount');

        // Step 6: Validate /discount page loads
        const discountRes = await agent.get('/discount');
        expect(discountRes.status).toBe(200);
    }),

        it('should navigate to the home page if the user is normal user', async () => {
            // Get a new token before this request
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
            // Get a new token before logout
            const tokenRes = await agent.get('/test-token');
            token = tokenRes.body.csrfToken;

            await agent.get('/logout');
            const res = await agent.get('/home');
            expect(res.header['location']).toBe('/login');
        })
});