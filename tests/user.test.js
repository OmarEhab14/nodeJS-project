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

describe('get all users', () => {
    it('should return all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
    }),
    it ('should return failure with status code 500', async () => {
        await mongoose.connection.close(); // we can do this or we can use mocking
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(500);
        await mongoose.connect(process.env.connect_DB)
    })
})

describe('get a user', () => {
    it('should return a user', async () => {
        const user = await userModel.create({
            username: "Omar",
            email: "omar@gmail.com",
            password: "505050",
            isTest: true,
        })
        const res = await request(app).get(`/api/users/${user._id}`)
        expect(res.status).toBe(200)
        expect(res.body.username).toBe("Omar")
    }),
    it('should return user not found', async () => {
        const res = await request(app).get(`/api/users/5050221`)
        expect(res.status).toBe(500)
    })
})

describe('post a user', () => {
    it('should create a user', async () => {
        const res = await request(app).post(`/api/users`).send({
            username: "Samir",
            email: "samir@gmail.com",
            password: "505050",
            isTest: true,
        })
        expect(res.status).toBe(200)
        expect(res.body.username).toBe("Samir")
    }),
    it('should fail to create a user', async () => {
        const res = await request(app).post('/api/users');
        expect(res.status).toBe(500)
    })
})

describe('update a user', () => {
    it('should update a user', async () => {
        const user = await userModel.create({
            username: "Ahmed",
            email: "ahmed@gmail.com",
            password: "505050",
            isTest: true,
        })
        const res = await request(app).put(`/api/users/${user._id}`).send({
            username: "Abdelrahman",
            email: "abdelrahman@gmail.com",
        })
        expect(res.status).toBe(200)
        expect(res.body.username).toBe("Abdelrahman");
    }),
    it('should return user not found', async () => {
        const res = await request(app).put(`/api/users/5d4f54d`).send({
            username: "Abdelrahman",
        })
        expect(res.status).toBe(500)
    }),
    it('should update a user\'s username', async () => {
        const user = await userModel.create({
            username: "Ali",
            email: "ali@gmail.com",
            password: "123456",
            isTest: true,
        });
        const res = await request(app).put(`/api/users/${user._id}`).send({
            username: "updated_ali",
        });
        expect(res.status).toBe(200);
        expect(res.body.username).toBe("updated_ali");
    }),
    it('should update a user\'s password', async () => {
        const user = await userModel.create({
            username: "Salma",
            email: "salma@gmail.com",
            password: "123456",
            isTest: true,
        });
        const res = await request(app).put(`/api/users/${user._id}`).send({
            password: "112233",
        });
        expect(res.status).toBe(200);
        expect(res.body.password).toBe("112233");
    }),
    it('should update isAdmin', async () => {
        const user = await userModel.create({
            username: "Karim",
            email: "karim@gmail.com",
            password: "123456",
            isAdmin: false,
            isTest: true,
        });
        const res = await request(app).put(`/api/users/${user._id}`).send({
            isAdmin: true,
        });
        expect(res.status).toBe(200);
        expect(res.body.isAdmin).toBe(true);
    });
    
    
})

describe('delete a user', () => {
    it('should delete a user', async () => {
        const user = await userModel.create({
            username: "Ziad",
            email: "ziad@gmail.com",
            password: "505050",
            isTest: true,
        });
        const res = await request(app).delete(`/api/users/${user._id}`);
        expect(res.status).toBe(200)
    }),
    it('should return user not found', async () => {
        const res = await request(app).delete('/api/users/45544');
        expect(res.status).toBe(500)
    })
})