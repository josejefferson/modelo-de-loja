const mongoose = require('mongoose')

const Request = mongoose.model('Requests', {
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

module.exports = Request