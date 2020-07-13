const { Sequelize, sequelize } = require('../config/connect');
const User = require('./User');

const Product = sequelize.define('produtos', {
	name: { type: Sequelize.STRING, allowNull: false },
	description: Sequelize.TEXT,
	price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
	image: Sequelize.STRING,
	stock: { type: Sequelize.INTEGER, allowNull: false }
})

// Product.sync({force:true})

module.exports = Product