const mongoose = require('mongoose')
const app = require('../app')
const userModel = require('../models/user.model')
const request = require('supertest')

require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB)
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
    beforeAll(() => {
        agent = request.agent(app);
    })
    it('should navigate to discount manager page if the user is admin', async () => {
        await agent
            .post('/register')
            .send({
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
            const res = await agent.get('/home');
            expect(res.header['location']).toBe('/discount')
            const discountRes = await agent.get('/discount')
            expect(discountRes.status).toBe(200)
    }),
    it('should navigate to the home page if the user is normal user', async() => {
        await agent
            .post('/register')
            .send({
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
    it('should navigate normally to the home page', async() => {
        const res = await agent.get('/home');
        expect(res.status).toBe(200);
    }),
    it('should fail to load the products in the home page.', async () => {
        await mongoose.connection.close();
        const res = await agent.get('/home');
        expect(res.status).toBe(500);
        await mongoose.connect(process.env.connect_DB);
    }),
    it('should redirect to the login page if the user is logged out from the system', async ()=> {
        await agent.get('/logout');
        const res = await agent.get('/home');
        expect(res.header['location']).toBe('/login');
    })
})