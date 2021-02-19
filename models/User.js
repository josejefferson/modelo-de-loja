const mongoose = require('mongoose')

const User = mongoose.model('User', {
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true }, // validate
	password: { type: String, required: true },
	admin: { type: Boolean, default: false },
})

module.exports = User

User.find().then(async u => {
	if (u.length === 0) {
		console.log('>> [MongoDB] Nenhum administrador encontrado! Criando um novo...')
		await User.create({
			name: 'Admin',
			email: 'admin@admin.com',
			password: '$2y$10$je/bgy85arfz2kLIFwEU.u55u08t.CO925vl9xSdwRI7iYFzybBQ6',
			admin: true
		})
		console.log('>> [MongoDB] Administrador criado!')
		console.log('>> [MongoDB] E-mail: admin@admin.com')
		console.log('>> [MongoDB] Senha: admin')
	}
})