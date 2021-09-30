const express = require('express')
const routes = express.Router()
const mongoose = require('mongoose')
const log = require('./log')('Error', 'red')

const { render } = require('../helpers/helpers')
routes.use((req, res, next) => {
	req.data = req.data || {}
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
routes.use('/', require('./login/routes'))
routes.get('/ads', render('ads', 'Anúncios')) // temp
routes.get('/highlights', render('highlights', 'Destaques')) // temp


function checkDB(req, res, next) {
	if (mongoose.connection.readyState != 1) {
		render('db-connecting', 'Conectando ao banco de dados')(req, res, next)
	}
	else next()
}

routes.use((err, req, res, next) => {
	if (req.body) req.flash('userData', req.body)
	if (err.isJoi) {
		log('Error from "Joi"')
		req.flash('errorMsg', 'Dados inválidos:\n' + err.message)
		res.redirect(req.headers.referer || req.originalUrl || '.')
	}
	else if (err.ejs) {
		log('EJS Error')
		console.error(err)
		req.flash('errorMsg', 'Ocorreu um erro ao acessar esta página')
		res.redirect('/')
	}
	else if (err.code == 11000) {
		log('Error 11000 from "Mongoose"')
		req.flash('errorMsg', 'Já existe uma entrada cadastrada no banco de dados')
		res.redirect(req.headers.referer || req.originalUrl || '.')
	}
	else if (err instanceof mongoose.Error.CastError) {
		log('Error CastError from "Mongoose"')
		res.status(500).send('ID inválido')
	}
	else {
		log('Unknown Error')
		console.error(err)
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao realizar esta ação')
		res.sendStatus(500)
	}
})

module.exports = routes