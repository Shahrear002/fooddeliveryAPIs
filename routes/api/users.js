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
        const email = req.body.email
        const curpass = req.body.password
        db.query('SELECT * FROM users WHERE email = ?', email, (error, rows) => {
            if(rows.length === 0) {
                error = 'User not found'
                res.status(400).json(error)
            } else {
                bcrypt.compare(curpass, rows[0].password, (error, result) => {
                    //console.log(result)
                    if(result) {
                        const payload = {
                            id: rows[0].id,
                            name: rows[0].name,
                            email: rows[0].email,
                            address: rows[0].address
                        }

                        jwt.sign(payload, keys.secretOrKey, {expiresIn: '60s'}, (error, token) => {
                            res.json({ success: true, token: 'Bearer ' + token })
                        })
                        console.log(payload)
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
    db.query('UPDATE users SET name=?, address=? WHERE id = ?', [ req.body.name, req.body.address, uid], (error, rows) => {
        if(rows.affectedRows) {
            res.status(200).json('User Info updated')
        } else {
            console.log(error)
        }
    })
    
    console.log(req.user.id)
    //res.status(200).json(req.user)
    //db.query('SELECT * FROM users WHERE ')
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
