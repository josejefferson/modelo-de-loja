const { Sequelize, sequelize } = require('../config/connect')

const User = sequelize.define('users', {
	name: { type: Sequelize.STRING, allowNull: false },
	email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
	password: { type: Sequelize.STRING, allowNull: false },
	admin: { type: Sequelize.BOOLEAN, defaultValue: false }
})

// sequelize.sync({force:true})

module.exports = User