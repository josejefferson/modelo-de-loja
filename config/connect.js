const Sequelize = require('sequelize')
const sequelize = new Sequelize('sql10353680', 'sql10353680', 'WpsIPTGfav', {
	host: 'sql10.freemysqlhosting.net',
	dialect: 'mysql',
	logging: false
})
sequelize.authenticate()
	.then(() => console.log('>> [MySQL] Conectado'))
	.catch(err => console.log(err))

module.exports = { Sequelize, sequelize };