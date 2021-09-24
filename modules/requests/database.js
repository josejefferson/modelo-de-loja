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
	status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
	open: { type: Boolean, default: true },
	feedback: String
})


function get({ id } = {}) {
	return Request.findById(id).populate('productId', 'name price image').populate('clientId')
}

function getAll() {
	return Request.find().populate('productId', 'name price image').populate('clientId')
}

function getAllFromClient({ clientID } = {}) {
	return Request.find({ clientId: clientID }).populate('productId', 'name price image').populate('clientId')
}

function add({ clientID, productID, quantity, other } = {}) {
	return Request.create({
		clientId: clientID,
		productId: productID,
		quantity: quantity,
		other: other
	}).then((request) => {
		return request
			.populate('productId', 'name price image')
			//.populate('clientId')
	})
	// verificar se o populate funciona assim
}

function remove({ id } = {}) {
	return Request.deleteMany({ _id: id })
}

module.exports = {
	Request,
	actions: {
		get,
		getAll,
		getAllFromClient,
		add,
		remove
	}
}