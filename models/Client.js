const { Sequelize, sequelize } = require('../config/connect')

const Client = sequelize.define('clients', {
	clientId: { type: Sequelize.STRING, allowNull: false },
	name: { type: Sequelize.STRING, allowNull: false },
	address: { type: Sequelize.STRING, allowNull: false },
	phone: { type: Sequelize.STRING },
	email: { type: Sequelize.STRING, validate: { isEmail: true } }
})

// Client.sync({force:true})

module.exports = Client