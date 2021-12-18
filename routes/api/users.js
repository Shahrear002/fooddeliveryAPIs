const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/keys')

//connect to db/sequelize
const sequelize = require('../../utils/db')
const User = require('../../models/User')

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route GET api/users/test
// @description test users route
// @access Public
router.get('/test', (req, res) => res.status(200).send('Hello'))

// @route GET api/users/register
// @description user registration
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    if(!isValid) {
        res.status(400).json(errors)
    } else {
        //console.log(email)
        User.findOne({ where: { email: req.body.email } }).then(user => {
            if(user != null) {
                error = "Email already exists"
                res.status(400).json(error)
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if(error)   console.log(error)
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        address: req.body.address
                    }).then(user => res.json(user))
                    .catch(error => console.log(error))
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }
})

// @route GET api/users/login
// @description user login
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)

    if(!isValid) {
        res.status(400).json(errors)
    } else {
        const curpass = req.body.password

        User.findOne({ where: { email: req.body.email } }).then(user => {
            if(user === null) {
                error = "User not found"
                res.status(400).json(error)
            } else {
                bcrypt.compare(curpass, user.password, (error, result) => {
                    if(result) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            address: user.address
                        }

                        jwt.sign(payload, keys.secretOrKey, {expiresIn: '60s'}, (error, token) => {
                            res.json({ success: true, token: 'Bearer ' + token })
                        })
                    } else {
                        error = "Password incorrect"
                        res.status(400).json(error)
                    }
                })
            }
        })
    }
})

// @route POST api/users/edituser
// @description update user information
// @access Private
router.post('/edituser', passport.authenticate('jwt', { session: false }), (req, res) => {
    const authHeader = req.headers.authorization

    if(authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, keys.secretOrKey, (error, user) => {
            if(error) {
                return res.status(400).json(error)
            }

            req.user = user
        })
    }
    
    const uid = req.user.id
    /*
    User.update({ name: req.body.name, address: req.body.address },
        { where: { id: uid }}, { multi: true },).then(user => {
        res.status(200).json('user info updated')
        console.log(user)
    })*/
    User.findByPk(uid).then(user => {
        user.name = req.body.name
        user.address = req.body.address
        user.save()
        res.status(200).json('User info updated')
    }).catch(error => {
        console.log(error)
    })
})


// @route POST api/users/logout
// @description user account logout
// @access Private
/*
router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    //res.cookie('jwt', ' ', { maxAge: 1 })

    console.log('logged out!')
    res.json('Logged out!')
})
*/
module.exports = router
