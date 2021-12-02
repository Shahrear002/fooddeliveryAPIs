const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('../models/connection')
const keys = require('./keys')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        db.query('SELECT * FROM users WHERE id = ?', jwt_payload.id, (error, user) => {
            if(error) {
                return done(error, false)
            } 
            if(user) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        })
    }))
}