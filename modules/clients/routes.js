const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const actions = require('./database')

// GET
routes.get('/',
	(req, res, next) => {
		actions.getMultiple({ ids: req.data.userIDs }).then((users) => {
			req.data.users = users
			next()
		}).catch(next)
	},
	render('clients', 'Clientes')
)

routes.get('/add',
	render('client-edit', 'Adicionar cliente')
)

routes.get('/edit/:id',
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((user) => {
			req.data.user = user
			next()
		}).catch(next)
	},
	render('client-edit', 'Editar cliente')
)


// POST
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
		req.flash('successMsg', `Usuário "${req.body.name}" criado`)
		res.redirect(req.query.r || '/clients')
	}).catch(next)
})

routes.post('/edit/:id', (req, res, next) => {
	actions.edit({
		id: req.params.id,
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		whatsapp: req.body.whatsapp,
		email: req.body.email
	}).then((client) => {
		req.flash('successMsg', `Usuário "${client.name}" editado com sucesso`)
		res.redirect(req.query.r || '/clients')
	}).catch(next)
})

module.exports = routes