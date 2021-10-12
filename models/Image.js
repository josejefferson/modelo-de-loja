const mongoose = require('mongoose')

const Image = mongoose.model('Images', {
	data: { type: Buffer, required: true },
	contentType: { type: String, required: true }
})

module.exports = Image