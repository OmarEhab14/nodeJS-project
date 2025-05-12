const mongoose = require('mongoose')
const app = require('../app')
const productModel = require('../models/product.model')
const request = require('supertest')

const {showDiscount, calculateNewPrice} = require('../helpers/discount')

require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB)
})

afterAll(async () => {
    await productModel.deleteMany({ isTest: true });
    await mongoose.connection.close();
})

describe('apply discount', () => {
    it('should apply a discount', async () => {
        const product = await productModel.create({
            title: "product1",
            price: 200,
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            isTest: true,
        });
        const res = await request(app).post('/api/discount').send({
            id: product._id,
            discount: 20,
        });
        expect(res.status).toBe(302);
    }),
        it('should return apply discount failure', async () => {
            const res = await request(app).post('/api/discount').send({
                id: "kdfjjdf",
                // discount: 20
            });
            expect(res.status).toBe(500);
        })
})

describe('displaying discount', () => {
    it ('should return true to show the discount', () => {
        expect(showDiscount(20)).toBeTruthy();
    }),
    it ('should return false when there is no discount', () => {
        expect(showDiscount(0)).toBeFalsy();
    })
})

describe('calculating discount', () => {
    it ('should return 80.00 when the discount is 20 and the price is 100', () => {
        expect(calculateNewPrice(100, 20)).toBe("80.00");
    }),
    it('should throw an error if the price was a negative number', () => {
        expect(() => calculateNewPrice(-20, 20)).toThrow()
    })
})