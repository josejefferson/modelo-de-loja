const { Sequelize, sequelize } = require('../config/connect')

const Usuario = sequelize.define('usuarios', {
	name: { type: Sequelize.STRING, allowNull: false },
	email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
	password: { type: Sequelize.STRING, allowNull: false },
	admin: { type: Sequelize.BOOLEAN, defaultValue: false }
})

Usuario.sync()

module.exports = Usuario