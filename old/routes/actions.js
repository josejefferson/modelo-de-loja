const express = require('express')
const routes = express.Router()
const passport = require('passport')
const check = require('../helpers/middlewares')
const validate = check.validate
const { body } = require('express-validator')
const Request = require('../models/Request')
const Client = require('../models/Client')
const functions = require('../helpers/helpers')

routes.post('/buy', check.userIdValid, [
	// >> fazer validation
], validate(), async (req, res) => {

	const client = await Client.findOne({ clientId: req.body.clientId })
	await Request.create({
		clientId: client.id,
		productId: req.body.product,
		quantity: req.body.quantity,
		other: req.body.other
	})

	req.flash('successMsg', 'Compra efetuada com sucesso!')
	res.redirect('/')
})

routes.post('/cart', async (req, res) => {
	const products = req.body.products.split(',')
	const { cart } = await functions.getCartItems(products, true)

	for (item of cart) {
		const client = await Client.findOne({ clientId: req.body.clientId })
		await Request.create({
			clientId: client.id,
			productId: item,
			quantity: 1
		})
	}

	req.flash('successMsg', 'Compras efetuadas com sucesso')
	res.redirect('/')
	// >> limpar carrinho
})

routes.post('/users/add', [/* >> verificar se o id já existe */], async (req, res) => {
	const clientId = functions.rndString()
	await Client.create({
		clientId,
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		email: req.body.email
	})

	if (!req.cookies.userIds) {
		res.cookie('userIds', clientId, { maxAge: 315360000000 })
	} else {
		let userIds = req.cookies.userIds.split(',')

		if (req.body.oldId) {
			userIds[userIds.indexOf(req.body.oldId)] = clientId
		} else {
			userIds.push(clientId)
		}

		userIds = userIds.join(',')
		res.cookie('userIds', userIds, { maxAge: 315360000000 })
	}

	res.redirect('/users')
})

routes.post('/login', check.notAuth, [
	body('email').notEmpty().withMessage('Digite seu e-mail').bail().isEmail().withMessage('E-mail inválido'),
	body('password').notEmpty().withMessage('Digite sua senha')
], validate(), (req, res, next) => {

	passport.authenticate('local', function (err, user, info) {

		if (err) {
			req.flash('errorMsg', 'Ocorreu um erro desconhecido')
			req.flash('data', req.body)
			return res.redirect('/login')
		}
		if (!user) {
			req.flash('errorMsg', info.message)
			req.flash('data', req.body)
			return res.redirect('/login')
		}
		req.logIn(user, function (err) {
			if (err) {
				req.flash('errorMsg', 'Ocorreu um erro desconhecido')
				req.flash('data', req.body)
				return res.redirect('/login')
			}

			// Logado com sucesso
			req.flash('successMsg', 'Logado com sucesso!')
			return res.redirect('/')
		})
	})(req, res, next)
})

module.exports = routes