const db = require('mongoose')
const user = db.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
    },
    isTest: {
        type: Boolean,
        required: false,
        default: false,
    },
});

module.exports = db.model('user', user);