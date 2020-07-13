const { Sequelize, sequelize } = require('../config/connect')

const User = sequelize.define('usuarios', {
	name: { type: Sequelize.STRING, allowNull: false },
	email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
	password: { type: Sequelize.STRING, allowNull: false },
	admin: { type: Sequelize.BOOLEAN, defaultValue: false }
})

// User.sync({force:true})

module.exports = User