const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const { actions } = require('./database')
const { validate, schema } = require('./validators')
const { admin } = require('../restrictions')

require('./sockets')
// routes.use(admin)

// GET
routes.get('/',
	async (req, res, next) => {
		actions.getAll().then((user) => {
			req.data.admins = user
			next()
		}).catch(next)
	},
	render(__dirname + '/admins', 'Administradores')
)

routes.get('/add',
	render(__dirname + '/admins-edit', 'Adicionar administrador')
)

routes.get('/edit/:id',
	async (req, res, next) => {
		actions.get({ id: req.params.id }).then((user) => {
			req.data.admin = user
			next()
		}).catch(next)
	},
	render(__dirname + '/admins-edit', 'Editar administrador')
)


// POST
routes.post('/add',
	validate(schema.add),
	(req, res, next) => {
		actions.add({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		}).then(() => {
			req.flash('successMsg', `Administrador "${req.body.name}" criado com sucesso`)
			res.redirect(req.query.r || '/admins')
			next()
		}).catch(next)
	}
)

routes.post('/edit/:id', (req, res, next) => {
	actions.edit({
		id: req.params.id,
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	}).then((user) => {
		req.flash('successMsg', `Administrador "${user.name}" editado com sucesso`)
		res.redirect(req.query.r || '/admins')
		next()
	}).catch(next)
})

routes.get('/remove/:id', (req, res, next) => {
	actions.remove({
		id: req.params.id
	}).then(() => {
		req.flash('successMsg', 'Administrador excluído com sucesso')
		res.redirect(req.query.r || '/admins')
		next()
	}).catch(next)
})

module.exports = routes