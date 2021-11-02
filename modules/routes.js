const express = require('express')
const routes = express.Router()
const mongoose = require('mongoose')
const logger = require('@modules/logger')
const fs = require('fs')

const { render, renderMsg } = require('@helpers/helpers')
routes.use((req, res, next) => {
	req.data = req.data || {}
	req.data.cart = []
	const cart = (req.cookies.cart && req.cookies.cart.split(',') || []) || []
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.cartIDs = cart
	req.data.userIDs = userIDs
	next()
})

routes.use('/', checkDB, require('@modules/home/routes'))
routes.use('/admins', checkDB, require('@modules/admins/routes'))
routes.use('/cart', checkDB, require('@modules/cart/routes'))
routes.use('/clients', checkDB, require('@modules/clients/routes'))
routes.use('/images', checkDB, require('@modules/images/routes'))
routes.use('/products', checkDB, require('@modules/products/routes'))
routes.use('/requests', checkDB, require('@modules/requests/routes'))
routes.use('/', require('@modules/login/routes'))
routes.get('/ads', render('ads', 'Anúncios')) // temp
routes.get('/highlights', render('highlights', 'Destaques')) // temp
routes.get('/logs', (req, res, next) => {
	const logs = fs.readFileSync('./logs.log', { encoding: 'utf-8' })
	req.data.logs = logs.split('\n').map((log) => log ? JSON.parse(log) : undefined).filter((log) => log)
	next()
}, render('logs', 'Logs')) // temp
routes.get('/test', render('_test', 'Testes')) // temp

// TEMP
const moment = require('moment')
const requestsDB = require('@modules/requests/database')
routes.get('/email/request/:id', checkDB, requestsDB.get, (req, res, next) => {
	res.render('others/email-request', {
		layout: false,
		moment: moment,
		request: req.data.request,
		purpose: 'feedback'
	})
	// render('email-request', 'E-mail', false, 'others')
})
routes.get('/test2', (req, res, next) => {
	res.render('others/email-confirm', {
		layout: false
	})
})


function checkDB(req, res, next) {
	if (mongoose.connection.readyState != 1) {
		if (req.method == 'GET') {
			res.status(202)
			render('db-connecting', 'Conectando ao banco de dados', false, 'others')(req, res, next)
		} else {
			mongoose.connection.once('connected', () => next())
		}
	} else next()
}

routes.use((req, res, next) => {
	if (res.writableEnded) return
	res.status(404).render('others/404', { _title: '404 Not Found' })
})

routes.use((err, req, res, next) => {
	if (req.body) req.flash('userData', req.body)
	if (err.isJoi) {
		logger('Joi').error(err)
		req.flash('errorMsg', 'Dados inválidos:\n' + err.message)
		if (err.redirect) res.redirect(req.headers.referer || req.originalUrl || '.')
		else {
			res.status(400)
			if (err.pageMessage) renderMsg(err.pageMessage.title, err.pageMessage.message)(req, res, next)
			else renderMsg('Dados inválidos', err.message)(req, res, next)
		}
	}
	else if (err.ejs) {
		logger('EJS').error(err)
		res.status(500).send('Ocorreu um erro ao mostrar esta página<br><a href="/">Voltar para a página inicial</a>')
	}
	else if (err.notFound) {
		logger('Mongoose').error('Object not found')
		res.status(404)
		renderMsg('Produto não encontrado', 'Talvez ele tenha sido excluído ou o link está incorreto')(req, res, next)
	}
	else if (err.code == 11000) {
		logger('Mongoose').error('Error 11000 from "Mongoose"')
		req.flash('errorMsg', 'Já existe uma entrada cadastrada no banco de dados')
		res.redirect(req.headers.referer || req.originalUrl || '.')
	}
	else if (err instanceof mongoose.Error.CastError) {
		logger('Mongoose').error('CastError')
		res.status(500).send('ID inválido')
	}
	else {
		logger().error(err)
		res.sendStatus(500)
	}
})

routes.use((err, req, res, next) => {
	logger('Algo deu errado').error(err)
	res.sendFile('views/error.html', { root: '.' })
})


module.exports = routes