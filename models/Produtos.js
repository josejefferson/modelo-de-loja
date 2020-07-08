const { Sequelize, sequelize } = require('../config/connect');
const Usuarios = require('./Usuarios');

const Produtos = sequelize.define('produtos', {
	name: { type: Sequelize.STRING, allowNull: false },
	description: Sequelize.TEXT,
	price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
	image: Sequelize.STRING,
	stock: { type: Sequelize.INTEGER, allowNull: false }
})

Produtos.sync({alter:true})

module.exports = Produtos