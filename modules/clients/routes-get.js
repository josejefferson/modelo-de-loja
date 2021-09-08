const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const actions = require('./db-actions')

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

module.exports = routes