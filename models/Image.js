const mongoose = require('mongoose')

const Image = mongoose.model('Images', {
	data: Buffer,
	contentType: String
})

module.exports = Image