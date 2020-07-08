const express = require('express')
const routes = express.Router()
const check = require('../helpers/checks')
const Produto = require('../models/Produto')

routes.get('/', async (req, res) => {
	const produtos = await Produto.findAll() // *todo adicionar catch
	res.render('pages/home', {
		_page: 'home',
		_title: 'Início',
		produtos // ** corrigir produtos: produtos em admin
	})
})

routes.get('/product/:id', async (req, res) => {// >> validar id
	const product = await Produto.findAll({ where: { id: req.params.id } }) // *todo adicionar catch
	res.render('pages/product', {
		_page: 'home',
		_title: 'Início',
		product
	})
})

routes.get('/buy/:id', async (req, res) => {
	const product = await Produto.findAll({ where: { id: req.params.id } }) // *todo adicionar catch
	
	if (!product[0].stock) {
		req.flash('error_msg', 'Este produto está esgotado')
		return res.redirect('/')
	}

	res.render('pages/buy', {
		_page: 'buy',
		_title: 'Comprar',
		product
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