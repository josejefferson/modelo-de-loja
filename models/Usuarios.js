const { Sequelize, sequelize } = require('../config/connect')

const Usuarios = sequelize.define('usuarios', {
	name: { type: Sequelize.STRING, allowNull: false },
	email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
	password: { type: Sequelize.STRING, allowNull: false },
	admin: { type: Sequelize.BOOLEAN, defaultValue: false }
})

Usuarios.sync()

module.exports = Usuarios