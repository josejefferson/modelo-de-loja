const Admin = require('mongoose').model('Admins')
const bcrypt = require('bcryptjs')
const log = require('../log')('MongoDB', 'cyan')
module.exports = db = {}

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


// Busca um administrador
db.get = (req, res, next) => {
	Admin.findById(req.params.id).then((admin) => {
		if (!admin) return res.status(400).render('others/error', {
			_title: 'Este administrador não existe',
			message: 'Talvez o link esteja incorreto ou o administrador foi excluído'
		})
		req.data.admin = admin
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar o administrador',
			message: 'Tente novamente recarregando a página'
		})
	})
}

// Busca todos os administradores
db.getAll = (req, res, next) => {
	Admin.find().select('-password').then((admins) => {
		req.data.admins = admins || []
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar administradores',
			message: 'Tente novamente recarregando a página'
		})
	})
}

// Adiciona um administrador
db.add = (req, res, next) => {
	Admin.create({
		name: req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		admin: true
	}).then(() => {
		req.flash('successMsg', `Administrador "${req.body.name}" adicionado com sucesso`)
		return res.redirect(req.query.r || '/admins')
	}).catch((err) => {
		// validar administrador já existente
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao criar administrador')
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/admins/add')
	})
}

// Edita um administrador
db.edit = (req, res, next) => {
	Admin.findById(req.params.id).then((user) => {
		if (req.body.name) user.name = req.body.name
		if (req.body.email) user.email = req.body.email
		if (req.body.password) user.password = bcrypt.hashSync(req.body.password, 10)
		return user.save()
	}).then(() => {
		req.flash('successMsg', `Administrador "${req.body.name}" editado com sucesso`)
		res.redirect(req.query.r || '/admins')
	}).catch((err) => {
		req.flash('errorMsg', err.message || 'Ocorreu um erro desconhecido ao editar administrador') // não colocar esses err.message
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/admins/edit/${req.params.id}`)
	})
}

// Remove um administrador
db.remove = (req, res, next) => {
	Admin.deleteMany({ _id: req.params.id }).then(() => {
		req.flash('successMsg', 'Administrador excluído com sucesso')
		res.redirect(req.query.r || '/admins')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir administrador')
		res.redirect(req.query.r || '/admins')
	})
}