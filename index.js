const express = require('express')
const mysql = require('mysql')
const passport = require('passport')

const users = require('./routes/api/users')

const db = require('./models/connection')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Passport
app.use(passport.initialize())
require('./config/passport') (passport)

app.use('/api/users', users)

const port = process.env.PORT || 8080
app.listen( port, () => {
    console.log(`Server is running on port ${port}`)
})