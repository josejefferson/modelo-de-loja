const Image = require('mongoose').model('Images')

function get({ id } = {}) {
	return Image.findOne({ _id: id })
}

function getAll() {
	return Image.find().select('-data')
}

function add({ file, contentType } = {}) {
	return Image.create({
		data: file,
		contentType: contentType
	})
}

function remove({ id } = {}) {
	return Image.deleteMany({ _id: id }) //TODO: findByIdAndDelete
}

module.exports = {
	get,
	getAll,
	add,
	remove
}