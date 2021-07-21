// Busca um administrador
function get() {
	return User.find().select('-password')
}

// Busca todos os administradores
function getAll({id} = {}) {
	return User.findById(id)
}

// Adiciona um novo administrador
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
function edit({ id, newName, newEmail, newPassword } = {}) {
	return User.findById(id).then(user => {
		if (!user) throw {
			message: 'O administrador não foi encontrado',
			redirect: '/admins'
		}

		if (newName) user.name = newName
		if (newEmail) user.email = newEmail
		if (newPassword) user.password = bcrypt.hashSync(newPassword, 10)

		return user.save()
	})
}

// Exclui um administrador
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