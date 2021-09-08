const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const actions = require('./db-actions')
const Client = require('../clients/model')

// Organiza os itens do carrinho
routes.use((req, res, next) => {
	const cart = (req.cookies.cart && req.cookies.cart.split(',') || []) || []
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.cartIDs = cart
	req.data.userIDs = userIDs
	next()
})

routes.get('/', g,
	(req, res, next) => {
		const cartItems = req.data.cartIDs
		actions.get(cartItems).then((products) => {
			res.cookie('cart', cartItems.join(','), { maxAge: 315360000000 })
			req.data.cart = cart.join(',')
			req.data.products = products
			next()
		})
	},
	(req, res, next) => {
		Client.find({ _id: req.data.userIDs }).then((users) => {
			req.data.users = users
			//todo: redirecionar caso não haja usuários na hora de comprar
			next()
		})
	},
	render('buy', 'Carrinho')
)

module.exports = routes