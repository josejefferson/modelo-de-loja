const express = require('express')
const routes = express.Router()
const actions = require('./db-actions')
// TODO: criar arquivo "restrictions.js" para colocar a variável /*"adm"*/

// routes.use(adm)
routes.post('/add', valid.adminsAdd, (req, res, next) => {
	actions.add({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	}).then(() => {
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

routes.post('/edit/:id', valid.adminsEdit, (req, res, next) => {
	actions.edit({
		id: req.params.id,
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	}).then((user) => {
		req.flash('success_msg', `Administrador "${user.name}" editado com sucesso`)
		res.redirect(req.query.r || '/admins')
		next()
	}).catch((err) => {
		req.flash('error_msg', err.message || 'Ocorreu um erro desconhecido ao editar o administrador')
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/admins/edit/${req.params.id}`)
	})
})

routes.get('/remove/:id', valid.adminsRemove, (req, res, next) => {
	actions.remove({
		id: req.params.id
	}).then(() => {
		req.flash('success_msg', 'Administrador excluído com sucesso')
		res.redirect(req.query.r || '/admins')
		next()
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir administrador')
		res.redirect(req.query.r || '/admins')
	})
})

module.exports = routes