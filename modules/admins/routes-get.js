const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const actions = require('./db-actions')

// routes.use(adm)
routes.get('/', g,
	async (req, res, next) => {
		actions.getAll().then((user) => {
			req.data.admins = user
			next()
		})
	},
	render('admin/admins', 'Administradores')
)

routes.get('/add',
	render('admin/adminsEdit', 'Adicionar administrador')
)

routes.get('/edit/:id', g,
	async (req, res, next) => {
		actions.get({ id: req.params.id }).then((user) => {
			req.data.admin = user
			next()
		})
	},
	render('admin/adminsEdit', 'Editar administrador')
)

module.exports = routes