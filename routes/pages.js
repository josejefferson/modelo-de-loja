const express = require('express')
const routes = express.Router()
const check = require('../helpers/checks')
const Product = require('../models/Product')
const Client = require('../models/Client')
const functions = require('../helpers/functions')

routes.get('/', async (req, res) => {
	const cart = (req.cookies.cart && req.cookies.cart.split(',')) || []
	const products = await Product.find() // *todo adicionar catch
	res.render('pages/home', {
		_page: 'home',
		_title: 'Início',
		products, // ** corrigir produtos: produtos em admin
		cart
	})
})

routes.get('/product/:id', async (req, res) => {// >> validar id
	const cart = (req.cookies.cart && req.cookies.cart.split(',')) || []
	const product = await Product.findOne({ _id: req.params.id }) // *todo adicionar catch
	res.render('pages/product', {
		_page: 'home',
		_title: 'Início',
		product,
		cart
	})
})

routes.get('/buy/:id', check.userIdValid, async (req, res) => {
	const product = await Product.findOne({ _id: req.params.id }) // *todo adicionar catch

	if (!product.stock) {
		req.flash('error_msg', 'Este produto está esgotado')
		return res.redirect('/')
	}

	const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	const users = await Client.find({ clientId: userIds })

	res.render('pages/buy', {
		_page: 'buy',
		_title: 'Comprar',
		product,
		users
	})
})

routes.get('/users', async (req, res) => {
	const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	const users = await Client.find({ clientId: userIds })
	res.render('pages/users', {
		_page: 'users',
		_title: 'Usuários',
		users
	})
})

routes.get('/users/add', async (req, res) => {
	if (req.query.edit) var selectedUser = await Client.findOne({ clientId: req.query.edit })
	res.render('pages/users-add', {
		_page: 'add_user',
		_title: `Adicionar usuário`,
		oldId: req.query.edit,
		selectedUser
	})
})

routes.get('/cart', check.userIdValid, async (req, res) => {
	let mycart = (req.cookies.cart && req.cookies.cart.split(',')) || []

	console.log(mycart)
	const { cart, products } = await functions.getCartItems(mycart)
	res.cookie('cart', cart.join(','), { maxAge: 315360000000 })

	const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	const users = await Client.find({ clientId: userIds })

	res.render('pages/cart', {
		_page: 'cart',
		_title: 'Carrinho de compras',
		products,
		users,
		cart: cart.join(',')
	})
})

routes.get('/login', check.notLoggedIn, (req, res) => {
	res.render('pages/login', {
		_page: 'login',
		_title: 'Login'
	})
})

routes.all('/logout', check.loggedIn, (req, res) => {
	req.logout()
	req.flash('success_msg', 'Deslogado com sucesso')
	res.redirect('/login')
})

module.exports = routes