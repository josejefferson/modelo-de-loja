const Sequelize = require('sequelize')
const sequelize = new Sequelize('loja', 'root', null, {
	host: 'localhost',
	dialect: 'mysql',
	logging: false
})
sequelize.authenticate()
	.then(() => console.log('>> [MySQL] Conectado'))
	.catch(err => console.log(err))

module.exports = { Sequelize, sequelize };