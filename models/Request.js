const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const schema = new mongoose.Schema({
	clientId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Clients',
		required: true
	},
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Products',
		required: true
	},
	quantity: { type: Number, default: 1 },
	other: String,
	date: { type: Date, default: Date.now },
	status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'canceled'], default: 'pending' },
	open: { type: Boolean, default: true },
	feedback: String
})

if (process.env.DB_ENC) schema.plugin(encrypt, {
	encryptionKey: process.env.DB_ENC_KEY,
	signingKey: process.env.DB_SIG_KEY
})

module.exports = mongoose.model('Requests', schema)