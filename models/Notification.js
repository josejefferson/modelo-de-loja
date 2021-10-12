const mongoose = require('mongoose')

const Notification = mongoose.model('Notifications', {
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Clients',
		required: true
	},
	title: String,
	message: String,
	url: String,
	image: String,
	icon: String,
	color: String,
	read: { type: Boolean, default: false }
})

module.exports = Notification