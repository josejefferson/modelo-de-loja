const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const actions = require('./db-actions')
// const get = require('../../helpers/getters')

const get = {
	admins: (req, res, next) => {
		actions.getAll().then(user => {
			req.data.admins = user
			next()
		})
	},
	admin: (req, res, next) => {
		const params = {
			id: req.params.id
		}

		actions.get(params).then(user => {
			req.data.admin = user
			next()
		})
	}
}

routes.get('/admins', /*adm,*/ g, get.admins, render('admin/admins', 'Administradores'))
routes.get('/admins/add', /*adm,*/ render('admin/adminsEdit', 'Adicionar administrador'))
routes.get('/admins/edit/:id', /*adm,*/ g, get.admin, render('admin/adminsEdit', 'Editar administrador'))

module.exports = routes