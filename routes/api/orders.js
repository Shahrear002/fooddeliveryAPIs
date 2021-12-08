const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/keys')
const Sequelize = require('sequelize')

//connect to db
const sequelize = require('../../utils/db')
const User = require('../../models/User')

// @route GET api/users/test
// @description test users route
// @access Public
router.get('/test', (req, res) => {
    User.findOne({ where: { id: '2' } }).then(user => {
        res.status(200).json(user.email)
        console.log(user)
    }).catch(error => console.log(error) )
})

module.exports = router