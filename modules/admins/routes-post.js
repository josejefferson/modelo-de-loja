const express = require('express')
const routes = express.Router()
const actions = require('./db-actions')
// TODO: criar arquivo "restrictions.js" para colocar a variável /*"adm"*/

routes.post('/admins/add', /*adm,*/ valid.adminsAdd, async (req, res, next) => {
	const params = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	}

	actions.adminsAdd(params).then(() => {
		req.flash('success_msg', `Administrador "${params.name}" criado com sucesso`)
		res.redirect(req.query.r || '/admins')
		next()
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao criar administrador')
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/admins/add')
		// TODO: Log file
	})
})

routes.post('/admins/edit/:id', /*adm,*/ valid.adminsEdit, async (req, res, next) => {
	const params = {
		id: req.params.id,
		newName: req.body.name,
		newEmail: req.body.email,
		newPassword: req.body.password
	}

	actions.edit(params).then(user => {
		req.flash('success_msg', `Administrador "${user.name}" editado com sucesso`)
		res.redirect(req.query.r || '/admins')
		next()
	}).catch(err => {
		req.flash('error_msg', err.message || 'Ocorreu um erro desconhecido ao procurar o administrador')
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/admins/edit/${req.params.id}`)
	})
})

routes.get('/admins/remove/:id', /*adm,*/ valid.adminsRemove, async (req, res, next) => {
	const params = {
		id: req.params.id
	}

	actions.remove(params).then(() => {
		req.flash('success_msg', 'Administrador excluído com sucesso')
		res.redirect(req.query.r || '/admins')
		next()
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir administrador')
		res.redirect(req.query.r || '/admins')
	})
})

module.exports = routes