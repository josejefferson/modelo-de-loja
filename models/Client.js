const mongoose = require('mongoose')

const Client = mongoose.model('Clients', {
	clientId: { type: String, required: true },
	name: { type: String, required: true },
	address: { type: String, required: true },
	phone: String,
	email: {
		type: String,
		required: true,
		/*validate: {
			validator: () => Promise.resolve(false), //
			message: 'E-mail inválido'
		}*/
	}
})

module.exports = Client