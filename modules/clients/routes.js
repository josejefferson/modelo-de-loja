const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const {actions} = require('./database')

// GET
routes.use((req, res, next) => {
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.userIds = userIDs
	next()
})

routes.get('/', g,
	(req, res, next) => {
		actions.getMultiple({ ids: req.data.userIDs }).then((users) => {
			req.data.users = users
			next()
		})
	},
	render('users', 'Usuários')
)

routes.get('/add',
	render('usersEdit', 'Adicionar usuário')
)

routes.get('/edit/:id', g,
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((user) => {
			req.data.user = user
			next()
		})
	},
	render('usersEdit', 'Editar usuário')
)


// POST
routes.use((req, res, next) => {
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.userIds = userIDs
	next()
})

routes.post('/add', (req, res, next) => {
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
	}).catch(next)
})

routes.post('/edit/:id', (req, res, next) => {
	actions.edit({
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		whatsapp: req.body.whatsapp,
		email: req.body.email
	}).then((client) => {
		req.flash('success_msg', `Usuário "${client.name}" editado com sucesso`)
		res.redirect(req.query.r || '/users')
	}).catch(next)
})

module.exports = routes