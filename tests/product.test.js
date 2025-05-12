const mongoose = require('mongoose')
const app = require('../app')
const productModel = require('../models/product.model')
const request = require('supertest')

require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB)
})

afterAll(async () => {
    await productModel.deleteMany({ isTest: true });
    await mongoose.connection.close();
})

describe('get all products', () => {
    it('should return all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
    }),
    it ('should return failure with status code 500', async () => {
        await mongoose.connection.close(); // we can do this or we can use mocking
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(500);
        await mongoose.connect(process.env.connect_DB)
        // Example using mocking
        // const mockFind = jest.spyOn(productModel, 'find').mockRejectedValueOnce(new Error('DB error'));

        // const res = await request(app).get('/api/products');
        // expect(res.status).toBe(500);

        // Restore the original implementation
        // mockFind.mockRestore();
    })
})

describe('get a product', () => {
    it('should return a product', async () => {
        const product = await productModel.create({
            title: "product1",
            price: 200,
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            isTest: true,
        })
        const res = await request(app).get(`/api/products/${product._id}`)
        expect(res.status).toBe(200)
        expect(res.body.title).toBe("product1")
    }),
    it('should return product not found', async () => {
        const res = await request(app).get(`/api/products/5050221`)
        expect(res.status).toBe(500)
    })
})

describe('post a product', () => {
    it('should create a product', async () => {
        const res = await request(app).post(`/api/products`).send({
            title: "product2",
            price: 400,
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            isTest: true,
        })
        expect(res.status).toBe(200)
        expect(res.body.title).toBe("product2")
    }),
    it('should fail to create a product', async () => {
        const res = await request(app).post('/api/products');
        expect(res.status).toBe(500)
    })
})

describe('update a product', () => {
    it('should update a product', async () => {
        const product = await productModel.create({
            title: "product4",
            price: 600,
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            isTest: true,
        })
        const res = await request(app).put(`/api/products/${product._id}`).send({
            title: "product5",
            price: 550,
        })
        expect(res.status).toBe(302)
    }),
    it('should return product not found', async () => {
        const res = await request(app).put(`/api/products/5d4f54d`).send({
            title: "product500",
        })
        expect(res.status).toBe(500)
    })
})

describe('delete a product', () => {
    it('should delete a product', async () => {
        const product = await productModel.create({
            title: "product6",
            price: 600,
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            isTest: true,
        });
        const res = await request(app).delete(`/api/products/${product._id}`);
        expect(res.status).toBe(302)
    }),
    it('should return product not found', async () => {
        const res = await request(app).delete('/api/products/45544');
        expect(res.status).toBe(500)
    })
})