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
        res.redirect('login');
    } catch (error) {
        console.log(error);
    }
})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', async (req, res, next) => {
    console.log(req.body)
    try {
        const currentUser = req.body;
        const checkedUser = await User.findOne({ name: currentUser.name });

        if (checkedUser) {
            if (bcrypt.compareSync(currentUser.password, checkedUser.passwordHash)) {
                const loggedInUser = { ...checkedUser._doc };
                delete loggedInUser.passwordHash
                res.redirect('/profile')
            } else {
                console.log('Incorrect password');
                res.render('auth/login', {errorMessage: 'Try again!'});
            }
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router