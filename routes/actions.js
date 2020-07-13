const express = require('express')
const routes = express.Router()
const passport = require('passport')
const check = require('../helpers/checks')
const validate = check.validate
const User = require('../models/User')
const validators = require('../helpers/validators')
const { body } = require('express-validator')
const Request = require('../models/Request')
const Client = require('../models/Client')

routes.post('/buy', check.userIdValid, [
	// >> fazer auth
], validate(), async (req, res) => {

	const client = await Client.findOne({ where: { clientId: req.body.clientId } })
	await Request.create({
		clientId: client.id,
		productId: req.body.product,
		other: req.body.other
	})

	req.flash('success_msg', 'Compra efetuada com sucesso!')
	res.redirect('/')
})

function rndString() {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let string = '';
	for (let i = 0; i < 64; i++) {
		string += chars[Math.floor(Math.random() * chars.length)];
	}
	return string;
}

routes.post('/users/add', [/** >> verificar se o id já existe */], async (req, res) => {
	const clientId = rndString()
	await Client.create({
		clientId,
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		email: req.body.email
	})

	if (!req.cookies.userIds) {
		res.cookie('userIds', clientId, { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 })
	} else {
		let userIds = req.cookies.userIds.split(',')

		if (req.body.oldId) {
			userIds[userIds.indexOf(req.body.oldId)] = clientId
		} else {
			userIds.push(clientId)
		}

		userIds = userIds.join(',')
		res.cookie('userIds', userIds, { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 })
	}

	res.redirect('/users')
})

routes.post('/login', check.notLoggedIn, [
	body('email').notEmpty().withMessage('Digite seu e-mail').bail().isEmail().withMessage('E-mail inválido'),
	body('password').notEmpty().withMessage('Digite sua senha')
], validate(), (req, res, next) => {

	passport.authenticate('local', function (err, user, info) {

		if (err) {
			req.flash('error_msg', 'Ocorreu um erro desconhecido')
			req.flash('data', req.body)
			return res.redirect('/login')
		}
		if (!user) {
			req.flash('error_msg', info.message)
			req.flash('data', req.body)
			return res.redirect('/login')
		}
		req.logIn(user, function (err) {
			if (err) {
				req.flash('error_msg', 'Ocorreu um erro desconhecido')
				req.flash('data', req.body)
				return res.redirect('/login')
			}

			// Logado com sucesso
			req.flash('success_msg', 'Logado com sucesso!')
			return res.redirect('/admin')
		});
	})(req, res, next)
})

module.exports = routes