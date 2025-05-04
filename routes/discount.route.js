const express = require('express');

const {
    discount,
} = require('../controllers/discount.controller');

const router = express.Router();

router.put('/discount', discount);

module.exports = router;