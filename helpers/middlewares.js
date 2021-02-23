const { validationResult } = require('express-validator')
const Client = require('../models/Client')

module.exports = {
	// Somente pessoas logadas
	auth: (req, res, next) => {
		if (req.isAuthenticated()) return next()
		req.flash('error_msg', 'Você não está logado')
		res.redirect(req.query.r || '/login')
	},

	// Somente pessoas não logadas
	notAuth: (req, res, next) => {
		if (!req.isAuthenticated()) return next()
		req.flash('error_msg', 'Você já está logado')
		res.redirect(req.query.r || '/')
	},

	// Somente admins
	admin: (req, res, next) => {
		if (req.isAuthenticated() && req.authUser.admin === true) return next()
		req.flash('error_msg', 'Você não tem permissão para entrar aqui')
		res.redirect(req.query.r || '/')
		// return next()
	},

	// Somente não admins
	notAdmin: (req, res, next) => {
		if (req.isAuthenticated() && req.authUser.admin === false) return next()
		req.flash('error_msg', 'Você não tem permissão para entrar aqui')
		res.redirect(req.query.r || '/')
	},

	// Somente pessoas não logadas ou admins ???
	notAuthORAdmin: (req, res, next) => {
		if (!req.isAuthenticated() || req.authUser.admin === true) return next()
		req.flash('error_msg', 'Você precisa deslogar para entrar aqui')
		res.redirect(req.query.r || '/')
	},

	// Cliente cadastrado
	userIdValid: async (req, res, next) => {
		if (req.cookies.userIds) {
			const userIdsArr = req.cookies.userIds.split(',')
			const clients = await Client.find({ _id: userIdsArr })
			if (clients.length) return next()
		}
		req.flash('error_msg', 'Cadastre seus dados para comprar')
		res.redirect(req.query.r || '/users/add')
	},

	// Validar dados de formulário com redirecionamento
	validate: (redir) => {
		return (req, res, next) => {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				errors.errors.forEach(err => {
					req.flash('error_msg', err.msg)
					req.flash('data', req.body)
				})
				return res.redirect(redir || req.originalUrl)
			}
			return next()
		}
	},

	// Validar dados de formulário
	isValid: function (req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			errors.errors.forEach(err => {
				req.flash('error_msg', err.msg)
				req.flash('data', req.body)
			})
			return false
		}
		return true
	}
}