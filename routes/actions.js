const express = require('express')
const routes = express.Router()
const passport = require('passport')
const check = require('../helpers/checks')
const validate = check.validate
const Usuario = require('../models/Usuario')
const validators = require('../helpers/validators')
const { body } = require('express-validator')
const Pedido = require('../models/Pedido')

routes.post('/buy', [
	// >> fazer auth
], validate(), async (req, res) => {
	await Pedido.create({
		userid: req.body.userid,
		produtoId: req.body.product,
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		email: req.body.email,
		other: req.body.other
	})

	req.flash('success_msg', 'Compra efetuada com sucesso!')
	res.redirect('/')
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