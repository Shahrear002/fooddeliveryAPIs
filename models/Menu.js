const Sequelize = require('sequelize')

const sequelize = require('../utils/db')

const Menu = sequelize.define('Menu', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    foodname: {
        type: sequelize.STRING(50),
        allowNull: false
    },
    price: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: sequelize.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = Menu