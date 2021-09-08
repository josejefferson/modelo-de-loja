const mongoose = require('mongoose')

const Client = mongoose.model('Clients', {
	// clientId: { type: String, required: true },
	name: { type: String, required: true },
	address: { type: String, required: true },
	phone: String,
	whatsapp: String,
	email: {
		type: String,
		/*validate: {
			validator: () => Promise.resolve(false), //
			message: 'E-mail inválido'
		}*/
	}
})

module.exports = Client