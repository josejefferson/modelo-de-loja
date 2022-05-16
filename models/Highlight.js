const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const schema = new mongoose.Schema({
})

if (process.env.DB_ENC) schema.plugin(encrypt, {
	encryptionKey: process.env.DB_ENC_KEY,
	signingKey: process.env.DB_SIG_KEY
})

module.exports = mongoose.model('Highlights', schema)