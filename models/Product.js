const mongoose = require('mongoose')

const Product = mongoose.model('Products', {
	name: { type: String, required: true },
	description: String,
	price: { type: Number, required: true },
	oldprice: { type: Number },
	badge: { type: String },
	rating: {
		_1: { type: Number, default: 0 },
		_2: { type: Number, default: 0 },
		_3: { type: Number, default: 0 },
		_4: { type: Number, default: 0 },
		_5: { type: Number, default: 0 }
	},
	image: String,
	media: [{
		type: { type: String, enum: ['image.url', 'image.id', 'youtube'] },
		value: String
	}],
	stock: { type: Number, required: true },
	hidden: { type: Boolean, default: false }
})

module.exports = Product