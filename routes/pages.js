const express = require('express')
const routes = express.Router()
const check = require('../helpers/checks')
const Product = require('../models/Product')
const Client = require('../models/Client')

routes.get('/', async (req, res) => {
	const produtos = await Product.findAll() // *todo adicionar catch
	res.render('pages/home', {
		_page: 'home',
		_title: 'Início',
		produtos // ** corrigir produtos: produtos em admin
	})
})

routes.get('/product/:id', async (req, res) => {// >> validar id
	const product = await Product.findOne({ where: { id: req.params.id } }) // *todo adicionar catch
	res.render('pages/product', {
		_page: 'home',
		_title: 'Início',
		product
	})
})

routes.get('/buy/:id', check.userIdValid, async (req, res) => {
	const product = await Product.findOne({ where: { id: req.params.id } }) // *todo adicionar catch

	if (!product.stock) {
		req.flash('error_msg', 'Este produto está esgotado')
		return res.redirect('/')
	}

	const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	const users = await Client.findAll({ where: { clientId: userIds } })

	res.render('pages/buy', {
		_page: 'buy',
		_title: 'Comprar',
		product,
		users
	})
})

routes.get('/users', async (req, res) => {
	const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	const users = await Client.findAll({ where: { clientId: userIds } })
	res.render('pages/users', {
		_page: 'users',
		_title: 'Usuários',
		users
	})
})

routes.get('/users/add', async (req, res) => {
	if (req.query.edit) var user = await Client.findOne({ where: { clientId: req.query.edit } })
	res.render('pages/users-add', {
		_page: 'add_user',
		_title: `Adicionar usuário`,
		oldId: req.query.edit,
		user
	})
})

routes.get('/cart', check.userIdValid, async (req, res) => {
	if (req.cookies.cart) var cart = req.cookies.cart.split(',')

	let products = [] // >> criar uma função corrigirCarrinho(carrinho, removerEsgotados?)
	for (item of cart) {
		const product = await Product.findOne({ where: { id: item } })
		if (product) {
			products.push(JSON.parse(JSON.stringify(product)))
		} else {
			cart.splice(cart.indexOf(item), cart.indexOf(item) + 1)
			res.cookie('cart', cart.join(','), { maxAge: 315360000000 })
		}
	}

	const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	const users = await Client.findAll({ where: { clientId: userIds } })

	res.render('pages/cart', {
		_page: 'cart',
		_title: 'Carrinho de compras',
		products,
		users
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