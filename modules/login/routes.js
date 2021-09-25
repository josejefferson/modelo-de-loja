const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const passport = require('passport')

// Restriction...
routes.get('/login',
	render('login', 'Painel do administrador')
)
routes.post('/login',
	(req, res, next) => {
		passport.authenticate('local', function (err, user, info) {
			if (err || !user) {
				req.flash('errorMsg', err ? 'Ocorreu um erro desconhecido' : info.message)
				req.flash('userData', req.body)
				return res.redirect(req.query.r || '/login')
			}
			req.logIn(user, err => {
				if (err) {
					req.flash('errorMsg', 'Ocorreu um erro desconhecido')
					req.flash('userData', req.body)
					return res.redirect(req.query.r || '/login')
				}

				return res.redirect(req.query.r || '/requests')
			})
		})(req, res, next)
	}
)

routes.all('/logout',
	(req, res, next) => {
		req.logout()
		res.redirect(req.query.r || '/login')
	}
)

module.exports = routes