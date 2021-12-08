const Sequelize = require('sequelize')

const sequelize = new Sequelize('USER','root','shahrearrootuser', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log("Conncetion Established")
} catch(error){
    console.log('Unable to find database', error)
}

module.exports = sequelize