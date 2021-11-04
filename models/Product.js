const mongoose = require('mongoose')

const Product = mongoose.model('Products', {
	name: { type: String, required: true },
	description: String,
	price: { type: Number, required: true },
	oldprice: { type: Number },
	badge: { type: String },
	rating: {
		type: mongoose.Mixed,
		1: Number,
		2: Number,
		3: Number,
		4: Number,
		5: Number,
		default: {1:0,2:0,3:0,4:0,5:0},
		get: function (r) {
			const items = Object.entries(r)
			let sum = 0
			let total = 0
			for (const [key,value] of items) {
				total += value
				sum += value * parseInt(key)
			}
			return {
				...r,
				average: Math.round(sum / total) || 0,
				totalUsers: total
			}
		}
	},
	image: {
		type: { type: String, enum: ['image.url', 'image.id'] },
		value: String
	},
	media: [{
		type: { type: String, enum: ['image.url', 'image.id', 'youtube'] },
		value: String
	}],
	stock: { type: Number, required: true },
	hidden: { type: Boolean, default: false }
})

module.exports = Product