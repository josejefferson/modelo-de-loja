const { Sequelize, sequelize } = require('../config/connect')
const Produto = require('./Produto')

const Pedido = sequelize.define('pedidos', {
	userid: { type: Sequelize.STRING, allowNull: false },
	produtoId: { type: Sequelize.INTEGER, allowNull: false },
	name: { type: Sequelize.STRING, allowNull: false },
	address: { type: Sequelize.STRING, allowNull: false },
	phone: Sequelize.STRING,
	email: Sequelize.STRING,
	other: Sequelize.TEXT,
	pending: { type: Sequelize.BOOLEAN, defaultValue: true },
	confirmed: { type: Sequelize.BOOLEAN, defaultValue: false }
	// >> quantidade
})

Pedido.belongsTo(Produto)

// Pedido.sync({force: true})

module.exports = Pedido