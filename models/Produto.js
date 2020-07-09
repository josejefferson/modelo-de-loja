const { Sequelize, sequelize } = require('../config/connect');
const Usuario = require('./Usuario');

const Produto = sequelize.define('produtos', {
	name: { type: Sequelize.STRING, allowNull: false },
	description: Sequelize.TEXT,
	price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
	image: Sequelize.STRING,
	stock: { type: Sequelize.INTEGER, allowNull: false }
})

// Produto.sync({force:true})

module.exports = Produto