const mongoose = require('mongoose')

const Admin = mongoose.model('Admins', {
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true }, // validate
	password: { type: String, required: true },
	admin: { type: Boolean, default: false },
})

module.exports = Admin