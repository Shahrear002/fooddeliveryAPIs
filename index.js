const express = require('express')
const mysql = require('mysql')
const passport = require('passport')

const users = require('./routes/api/users')
const orders = require('./routes/api/orders')

const sequelize = require('./utils/db')

const User = require('./models/User')

sequelize.sync()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Passport
app.use(passport.initialize())
require('./config/passport') (passport)

app.use('/api/users', users)
app.use('/api/orders', orders)

const port = process.env.PORT || 8080
app.listen( port, () => {
    console.log(`Server is running on port ${port}`)
})