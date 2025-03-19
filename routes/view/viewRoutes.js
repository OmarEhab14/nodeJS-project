const express = require('express')
const router = express.Router()

router.get('/home', (req, res) => {
    console.log("here am I")
    if (!req.session.user) {
        console.log('here am I!!!!')
        return res.redirect('/login');
    }
    console.log('here here I am')
    console.log('what a session:' + req.session.user)
    res.render('../views/home.ejs', {user: req.session.user})
})

router.get('/login', (req, res) => {
    res.render('../views/login.ejs');
})

router.get('/register', (req, res) => {
    res.render('../views/register.ejs')
})



module.exports = router