const mongoose = require('mongoose')

const Product = mongoose.model('Products', {
	name: { type: String, required: true },
	description: String,
	price: { type: Number, required: true },
	image: String,
	stock: {type: Number, required: true}
})

module.exports = Product