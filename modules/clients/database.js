const Client = require('mongoose').model('Clients')

function get({ id } = {}) {
	return Client.findById(id)
}

function getMultiple({ ids } = {}) {
	return Client.find({ _id: ids })
}

function getAll() {
	return Client.find()
}

function add({ name, address, phone, whatsapp, email } = {}) {
	return Client.create({
		name: name,
		address: address,
		phone: phone,
		whatsapp: whatsapp,
		email: email
	})
}

function edit({ id, name, address, phone, whatsapp, email } = {}) {
	return Client.findById(id).then((client) => {
		if (name) client.name = name
		if (address) client.address = address
		if (phone) client.phone = phone
		if (whatsapp) client.whatsapp = whatsapp
		if (email) client.email = email

		return client.save()
	})
}

function remove({ id } = {}) {
	return Client.removeMany({ _id: id })
}

module.exports = {
	get,
	getMultiple,
	getAll,
	add,
	edit,
	remove
}