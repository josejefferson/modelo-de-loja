const Admin = require('mongoose').model('Admins')
const bcrypt = require('bcryptjs')
const log = require('../log')('MongoDB', 'cyan')

// CRIA UM ADMINISTRADOR CASO NÃO EXISTA NENHUM
Admin.find().then(admin => {
	if (admin.length === 0) createDefaultAdmin()
})

async function createDefaultAdmin() {
	log('Nenhum administrador encontrado! Criando um novo...')
	await Admin.create({
		name: 'Admin',
		email: 'admin@admin.com',
		password: '$2y$10$je/bgy85arfz2kLIFwEU.u55u08t.CO925vl9xSdwRI7iYFzybBQ6',
		admin: true
	})
	log('Administrador criado!', 'green')
	log('E-mail: admin@admin.com', 'magenta')
	log('Senha:  admin', 'magenta')
}


// AÇÕES
// Busca um administrador
function get({ id } = {}) {
	return Admin.findById(id)
}

// Busca todos os administradores
function getAll() {
	return Admin.find().select('-password')
}

// Adiciona um administrador
function add({ name, email, password } = {}) {
	return Admin.create({
		name: name,
		email: email,
		password: bcrypt.hashSync(password, 10),
		admin: true
	})
}

// Edita um administrador
function edit({ id, name, email, password } = {}) {
	return Admin.findById(id).then(user => {
		if (name) user.name = name
		if (email) user.email = email
		if (password) user.password = bcrypt.hashSync(password, 10)

		return user.save()
	})
}

// Remove um administrador
function remove({ id } = {}) {
	return Admin.deleteMany({ _id: id })
}

module.exports = {
	get,
	getAll,
	add,
	edit,
	remove
}