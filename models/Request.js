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
	pending: { type: Boolean, default: true },
	confirmed: { type: Boolean, default: false },
	done: { type: Boolean, default: false }
})

module.exports = Request