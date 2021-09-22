const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// MODELO
const User = mongoose.model('User', {
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true }, // validate
	password: { type: String, required: true },
	admin: { type: Boolean, default: false },
})


// CRIA UM ADMINISTRADOR CASO NÃO EXISTA NENHUM
User.find().then(user => {
	if (user.length === 0) createDefaultAdmin()
})

async function createDefaultAdmin() {
	console.log('>> [MongoDB] Nenhum administrador encontrado! Criando um novo...')
	await User.create({
		name: 'Admin',
		email: 'admin@admin.com',
		password: '$2y$10$je/bgy85arfz2kLIFwEU.u55u08t.CO925vl9xSdwRI7iYFzybBQ6',
		admin: true
	})
	console.log('>> [MongoDB] Administrador criado!')
	console.log('>> [MongoDB] E-mail: admin@admin.com')
	console.log('>> [MongoDB] Senha:  admin')
}


// AÇÕES
// Busca um administrador
function get({ id } = {}) {
	return User.findById(id)
}

// Busca todos os administradores
function getAll() {
	return User.find().select('-password')
}

// Adiciona um administrador
function add({ name, email, password } = {}) {
	return User.create({
		name: name,
		email: email,
		password: bcrypt.hashSync(password, 10),
		admin: true
	})
}

// Edita um administrador
function edit({ id, name, email, password } = {}) {
	return User.findById(id).then(user => {
		if (name) user.name = name
		if (email) user.email = email
		if (password) user.password = bcrypt.hashSync(password, 10)

		return user.save()
	})
}

// Remove um administrador
function remove({ id } = {}) {
	return User.deleteMany({ _id: id })
}

module.exports = {
	User,
	actions: {
		get,
		getAll,
		add,
		edit,
		remove
	}
}