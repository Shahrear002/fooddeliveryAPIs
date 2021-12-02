const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/keys')

//connect to db
const db = require('../../models/connection')

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route GET api/users/test
// @description test users route
// @access Public
router.get('/test', (req, res) => res.status(200).send('Hello'))

// @route GET api/users/testuser
// @description test users route
// @access Public
router.get('/user', (req, res) => {
    db.query('SELECT * FROM users', (err, rows) => {
        if(!err) {
            res.json({ rows })
        } else {
            console.log(err)
        }

        console.log('User data: \n', rows)
    })
})

// @route GET api/users/register
// @description user registration
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    if(!isValid) {
        res.status(400).json(errors)
    } else {
        const email = req.body.email
        //console.log(email)
        db.query('SELECT * FROM users WHERE email = ?', email, (error, rows) => {
            if(rows.length > 0) {
                error = "Email already exists"
                res.status(400).json(error)
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    const data = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        address: req.body.address
                    }
                    
                    db.query('INSERT INTO users SET ?', data, (error, rows) => {
                        if(error) console.log(error)
                        else {
                            res.status(200).json({ msg: 'New User created!'})
                        }
                    })
                })
            }
            console.log(rows)
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
        const email = req.body.email
        const curpass = req.body.password
        db.query('SELECT * FROM users WHERE email = ?', email, (error, rows) => {
            if(rows.length === 0) {
                error = 'User not found'
                res.status(400).json(error)
            } else {
                bcrypt.compare(curpass, rows[0].password, (error, result) => {
                    console.log(result)
                    if(result) {
                        const payload = {
                            id: rows[0].id,
                            name: rows[0].name,
                            email: rows[0].email,
                            address: rows[0].address
                        }

                        jwt.sign(payload, keys.secretOrKey, {expiresIn: '30s'}, (error, token) => {
                            res.json({ success: true, token: 'Bearer' + token })
                        })
                        console.log('Logged in!')
                    } else {
                        error = 'Password incorrect'
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
