const Request = require('./model')

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
	}).populate('productId', 'name price image')
		.populate('clientId')
	// verificar se o populate funciona assim
}

function remove({ id } = {}) {
	return Request.deleteMany({ _id: id })
}

module.exports = {
	get,
	getAll,
	getAllFromClient,
	add
}