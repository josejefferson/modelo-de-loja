const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const schema = new mongoose.Schema({
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Clients',
		required: true
	},
	title: String,
	message: String,
	url: String,
	image: String,
	icon: String,
	color: String,
	read: { type: Boolean, default: false }
})

if (process.env.DB_ENC) schema.plugin(encrypt, {
	encryptionKey: process.env.DB_ENC_KEY,
	signingKey: process.env.DB_SIG_KEY
})

module.exports = mongoose.model('Notifications', schema)