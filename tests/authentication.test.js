const mongoose = require('mongoose')
const app = require('../app')
const userModel = require('../models/user.model')
const request = require('supertest')

require('dotenv').config()
let token;
let csrfCookie;

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB)
    const res = await request(app).get('/test-token');
    token = res.body.csrfToken;
    csrfCookie = res.headers['set-cookie'][0];
})

afterAll(async () => {
    await userModel.deleteMany({ isTest: true });
    await mongoose.connection.close();
})

describe('register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .set('Cookie', csrfCookie)
            .send({
                _csrf: token,
                firstName: "Karim",
                lastName: "Mostafa",
                mobile: "01011122233",
                gender: "male",
                username: "Karim",
                email: "karim@gmail.com",
                password: "505050",
                confirmPassword: "505050",
                isTest: true,
            });
        expect(res.status).toBe(302);
    });

    it('should return failure if the user already exists', async () => {
        const res = await request(app)
            .post('/register')
            .set('Cookie', csrfCookie)
            .send({
                _csrf: token,
                firstName: "Karim",
                lastName: "Mostafa",
                mobile: "01011122233",
                gender: "male",
                username: "Karim",
                email: "karim@gmail.com",
                password: "505050",
                confirmPassword: "505050",
                isTest: true,
            });
        expect(res.status).toBe(400);
    });

    it('should return failure if a required field is missing', async () => {
        const res = await request(app)
            .post('/register')
            .set('Cookie', csrfCookie)
            .send({
                _csrf: token,
                mobile: "01011122233",
                gender: "male",
                username: "Karim",
                email: "karim@gmail.com",
                password: "505050",
                confirmPassword: "505050",
                isTest: true,
            });
        expect(res.status).toBe(400);
    });

    it('should return failure if the password doesn\'t match the password confirmation field', async () => {
        const res = await request(app)
            .post('/register')
            .set('Cookie', csrfCookie)
            .send({
                _csrf: token,
                firstName: "Karim",
                lastName: "Mostafa",
                mobile: "01011122233",
                gender: "male",
                username: "Karim",
                email: "karim@gmail.com",
                password: "505050",
                confirmPassword: "606060",
                isTest: true,
            });
        expect(res.status).toBe(400);
    });
});

describe('login', () => {
    it('should login to the system', async () => {
        const res = await request(app)
            .post('/login')
            .set('Cookie', csrfCookie)
            .send({
                _csrf: token,
                email: "karim@gmail.com",
                password: "505050",
            });
        expect(res.status).toBe(302);
    });

    it('should return failure if the password is incorrect', async () => {
        const res = await request(app)
            .post('/login')
            .set('Cookie', csrfCookie)
            .send({
                _csrf: token,
                email: "karim@gmail.com",
                password: "606060",
            });
        expect(res.status).toBe(400);
    });

    it('should return failure if the email is invalid', async () => {
        const res = await request(app)
            .post('/login')
            .set('Cookie', csrfCookie)
            .send({
                _csrf: token,
                email: "invalidEmail@gmail.com",
                password: "202020",
            });
        expect(res.status).toBe(400);
    });
});

describe('logout', () => {
    it('should logout from the system', async () => {
        const res = await request(app)
            .get('/logout')
            .set('Cookie', csrfCookie);
        expect(res.status).toBe(302);
    });
});