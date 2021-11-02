const mongoose = require('mongoose')

const Client = mongoose.model('Clients', {
	name: { type: String, required: true },
	address: { type: String, required: true },
	phone: String,
	whatsapp: String,
	email: {
		type: String
		/*validate: {
			validator: () => Promise.resolve(false), //
			message: 'E-mail inválido'
		}*/
	},
	sendEmails: { type: Boolean, default: false },
	emailConfirmed: { type: Boolean, default: false },
	emailVerificationToken: { type: String }
})

module.exports = Client