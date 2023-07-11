const express = require('express')
const User = require('../models/User.model')
const router = express.Router()
const bcrypt = require('bcryptjs')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
    const payload = { ...req.body };
    const salt = bcrypt.genSaltSync(13);
    payload.passwordHash = bcrypt.hashSync(payload.password, salt);

    try {
        const newUser = await User.create(payload);
        res.send(newUser)
    } catch (error) {
        console.log(error);
    }
})

module.exports = router