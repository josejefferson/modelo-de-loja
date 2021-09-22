const mongoose = require('mongoose')

const Image = mongoose.model('Images', {
	data: Buffer,
	contentType: String
})


function get({ id } = {}) {
	return Image.findOne({ _id: id })
}

function getAll() {
	return Image.find().select('-data')
}

function add({file, mimetype}) {
	return Image.create({
		data: file,
		mimetype: mimetype
	})
}

function remove({ id } = {}) {
	return Image.deleteMany({ _id: id }) //TODO: findByIdAndDelete
}

module.exports = {
	Image,
	actions: {
		get,
		getAll,
		add,
		remove
	}
}