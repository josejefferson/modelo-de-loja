const User = require('./model')

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
	// TODO: Verificar se já não existe um admin com o mesmo email
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
	get,
	getAll,
	add,
	edit,
	remove
}