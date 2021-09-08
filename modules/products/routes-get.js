const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const actions = require('./db-actions')

// routes.use(adm)
routes.get('/', g, get.cart, // get cart
	(req, res, next) => {
		actions.getAll().then((products) => {
			req.data.products = products
			req.data.products.reverse().sort((a, b) => {
				return b.stock === 0 ? -1 : 0
			})
			next()
		})
	},
	render('admin/products', 'Produtos')
)

routes.get('/add',
	render('admin/productsEdit', 'Adicionar produto')
)

routes.get('/edit/:id', g,
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((product) => {
			req.data.product = product
			next()
		})
	},
	render('admin/productsEdit', 'Editar produto')
)

module.exports = routes