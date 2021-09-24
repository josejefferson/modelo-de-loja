const express = require('express')
const routes = express.Router()
const mongoose = require('mongoose')

const { g } = require('../helpers/helpers')
routes.use(g, (req, res, next) => {
	req.data.cart = []
	const cart = (req.cookies.cart && req.cookies.cart.split(',') || []) || []
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.cartIDs = cart
	req.data.userIDs = userIDs
	next()
})

routes.use('/', checkDB, require('./home/routes'))
routes.use('/admins', checkDB, require('./admins/routes'))
routes.use('/cart', checkDB, require('./cart/routes'))
routes.use('/clients', checkDB, require('./clients/routes'))
routes.use('/images', checkDB, require('./images/routes'))
routes.use('/products', checkDB, require('./products/routes'))
routes.use('/requests', checkDB, require('./requests/routes'))
routes.use('/buy', checkDB, require('./buy'))


function checkDB(req, res, next) {
	if (mongoose.connection.readyState != 1) {
		res.send('Conectando o banco de dados... Aguarde!<script>setTimeout(()=>location.reload(),5000)</script>')
	}
	else next()
}

routes.use((err, req, res, next) => {
	if (req.body) req.flash('userData', req.body)
	if (err.isJoi) {
		req.flash('errorMsg', 'Dados inválidos:\n' + err.message)
		res.redirect(req.headers.referer || req.originalUrl || '.')
	}
	else if (err.code == 11000) {
		req.flash('errorMsg', 'Já existe uma entrada cadastrada no banco de dados')
		res.redirect(req.headers.referer || req.originalUrl || '.')
	}
	else if (err instanceof mongoose.Error.CastError) {
		res.status(500).send('ID inválido')
	}
	else {
		console.error(err)
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao realizar esta ação')
		res.sendStatus(500)
	}
})

module.exports = routes