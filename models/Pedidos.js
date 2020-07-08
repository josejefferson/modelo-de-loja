const { Sequelize, sequelize } = require('../config/connect')

const Pedidos = sequelize.define('pedidos', {
	userid: { type: Sequelize.STRING, allowNull: false },
	product: { type: Sequelize.INTEGER, allowNull: false },
	name: { type: Sequelize.STRING, allowNull: false },
	address: { type: Sequelize.STRING, allowNull: false },
	phone: Sequelize.STRING,
	email: Sequelize.STRING,
	other: Sequelize.TEXT,
	pending: { type: Sequelize.BOOLEAN, defaultValue: true },
	confirmed: { type: Sequelize.BOOLEAN, defaultValue: false }
	// >> quantidade
})

Pedidos.sync({ alter: true })

module.exports = Pedidos