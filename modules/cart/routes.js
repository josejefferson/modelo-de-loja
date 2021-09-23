const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const { actions } = require('./database')
const { Client, actions: clientActions } = require('../clients/database')

routes.get('/',
	(req, res, next) => {
		actions.get(req.data.cartIDs).then((products) => {
			req.data.products = products
			next()
		}).catch(next)
	}, (req, res, next) => {
		clientActions.getMultiple({ ids: req.data.userIDs }).then((users) => {
			req.data.users = users
			// redirecionar se não houver usuários
			next()
		}).catch(next)
	}, render(__dirname + '/main', 'Carrinho')
)

module.exports = routes