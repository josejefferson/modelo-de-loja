const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const { actions } = require('./database')
const { actions: clientActions } = require('../clients/database')
const { Client } = require('../clients/database')

// Organiza os itens do carrinho
routes.use((req, res, next) => {
	const cart = (req.cookies.cart && req.cookies.cart.split(',') || []) || []
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.cartIDs = cart
	req.data.userIDs = userIDs
	next()
})

// routes.get('/cart', g, get.cart, get.cartProds, get.users, render('buy', 'Carrinho'))

routes.get('/', g,
	(req, res, next) => {
		actions.get(req.data.cartIDs).then((products) => {
			req.data.products = products
			next()
		}).catch(next)
	}, (req, res, next) => {
		clientActions.getMultiple({ ids: req.data.userIDs }).then((users) => {
			req.data.users = users
			next()
		}).catch(next)
	}, render(__dirname + '/main', 'Carrinho')
)

/*routes.get('/', g,
	(req, res, next) => {
		const cartItems = req.data.cartIDs
		actions.get(cartItems).then((products) => {
			res.cookie('cart', cartItems.join(','), { maxAge: 315360000000 })
			// req.data.cart = cart.join(',')
			req.data.products = products
			next()
		}).catch(next)
	},
	(req, res, next) => {
		Client.find({ _id: req.data.userIDs }).then((users) => {
			req.data.users = users
			//todo: redirecionar caso não haja usuários na hora de comprar
			next()
		}).catch(next)
	},
	render(__dirname + '/buy', 'Carrinho')
)*/

module.exports = routes