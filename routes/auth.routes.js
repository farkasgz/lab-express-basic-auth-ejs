const express = require('express')
const User = require('../models/User.model')
const router = express.Router()
const bcrypt = require('bcryptjs')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
    const payload = { ...req.body };
    delete payload.password
    const salt = bcrypt.genSaltSync(13);
    payload.passwordHash = bcrypt.hashSync(req.body.password, salt);

    try {
        const newUser = await User.create(payload);
        res.redirect('/auth/login');
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
        const checkedUser = await User.findOne({ username: req.body.username });  

        if (checkedUser) {
            if (bcrypt.compareSync(req.body.password, checkedUser.passwordHash)) {
                const loggedInUser = checkedUser;
                delete loggedInUser.passwordHash;
                req.session.user = loggedInUser;
                console.log(req.session.user);
                res.redirect('/profile');
            } else {
                console.log('Incorrect password');
                res.render('auth/login', {errorMessage: 'Try again!'});
            }
        } else {
            console.log('No user with this email')
            res.render('auth/login', {errorMessage: 'Try again!'});
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router