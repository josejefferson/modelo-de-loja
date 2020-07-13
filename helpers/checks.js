const { validationResult } = require('express-validator')

module.exports = {
	// Somente pessoas logadas
	loggedIn: function (req, res, next) {
		if (req.isAuthenticated()) { return next() }
		req.flash('error_msg', 'Você não está logado')
		res.redirect('/login')
	},

	// Somente pessoas não logadas
	notLoggedIn: function (req, res, next) {
		if (!req.isAuthenticated()) { return next() }
		req.flash('error_msg', 'Você já está logado')
		res.redirect('/')
	},

	// Somente admins
	admin: function (req, res, next) {
		if (req.isAuthenticated() && req.user.admin === true) { return next() }
		req.flash('error_msg', 'Você não tem permissão para entrar aqui')
		res.redirect('/')
		// return next()
	},

	// Somente não admins
	notAdmin: function (req, res, next) {
		if (req.isAuthenticated() && req.user.admin === false) { return next() }
		req.flash('error_msg', 'Você não tem permissão para entrar aqui')
		res.redirect('/admin')
	},

	// Somente pessoas não logadas ou admins
	notLoggedInORNotAdmin: function (req, res, next) {
		if (!req.isAuthenticated() || req.user.admin === true) { return next() }
		req.flash('error_msg', 'Você precisa deslogar para entrar aqui')
		res.redirect('/')
	},

	validate: function (redir) {
		return function (req, res, next) {
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