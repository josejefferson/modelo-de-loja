const express = require('express')
const routes = express.Router()
const actions = require('./db-actions')

routes.use((req, res, next) => {
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.userIds = userIDs
	next()
})

routes.post('/add', valid.usersAdd, (req, res, next) => {
	actions.add({
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		whatsapp: req.body.whatsapp,
		email: req.body.email
	}).then((client) => {
		req.data.userIDs.push(client._id)
		res.cookie('userIds', req.data.userIDs.join(','), { maxAge: 315360000000 })
		req.flash('success_msg', `Usuário "${req.body.name}" criado`)
		res.redirect(req.query.r || '/users')
	}).catch((err) => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao criar usuário')
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/users/add')
	})
})

routes.post('/edit/:id', valid.usersEdit, (req, res, next) => {
	actions.edit({
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		whatsapp: req.body.whatsapp,
		email: req.body.email
	}).then((client) => {
		req.flash('success_msg', `Usuário "${client.name}" editado com sucesso`)
		res.redirect(req.query.r || '/users')
	}).catch((err) => {
		req.flash('error_msg', err.message || 'Ocorreu um erro desconhecido ao editar o usuário')
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/users/edit/${req.params.id}`)
	})
})