const { Sequelize, sequelize } = require('../config/connect')
const Product = require('./Product')
const Client = require('./Client')

const Request = sequelize.define('requests', {
	clientId: { type: Sequelize.INTEGER, allowNull: false },
	productId: { type: Sequelize.INTEGER, allowNull: false },
	other: Sequelize.TEXT,
	pending: { type: Sequelize.BOOLEAN, defaultValue: true },
	confirmed: { type: Sequelize.BOOLEAN, defaultValue: false },
	done: { type: Sequelize.BOOLEAN, defaultValue: false }
	// >> quantidade
})

Request.belongsTo(Product)
Request.belongsTo(Client)

// Request.sync({force: true})

module.exports = Request