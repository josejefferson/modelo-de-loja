const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const schema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true }, // validate
	password: { type: String, required: true },
	admin: { type: Boolean, default: false },
})

if (process.env.DB_ENC) schema.plugin(encrypt, {
	encryptionKey: process.env.DB_ENC_KEY,
	signingKey: process.env.DB_SIG_KEY
})

module.exports = mongoose.model('Admins', schema)