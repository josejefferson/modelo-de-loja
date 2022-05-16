const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const schema = new mongoose.Schema({
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

if (process.env.DB_ENC) schema.plugin(encrypt, {
	encryptionKey: process.env.DB_ENC_KEY,
	signingKey: process.env.DB_SIG_KEY
})

module.exports = mongoose.model('Clients', schema)