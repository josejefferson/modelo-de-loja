const express = require('express')
const routes = express.Router()

require('./admins/database')
require('./clients/database')
require('./images/database')
require('./products/database')
require('./requests/database')

routes.use('/admins', require('./admins/routes'))
routes.use('/cart', require('./cart/routes'))
routes.use('/clients', require('./clients/routes'))
routes.use('/images', require('./images/routes'))
routes.use('/products', require('./products/routes'))
routes.use('/requests', require('./requests/routes'))

routes.use((err, req, res, next) => {
	console.log(err)
	if (err.isJoi) {
		req.flash('error_msg', 'Dados inválidos:\n' + err.message)
		res.redirect(req.headers.referer ||req.originalUrl || '.')
	}
	else if (err.code == 11000) {
		req.flash('error_msg', 'Já existe uma entrada cadastrada no banco de dados')
		res.redirect(req.headers.referer ||req.originalUrl || '.')
	}
	else {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao realizar esta ação')
	}
	if (req.body) req.flash('userData', req.body)
	//res.redirect(req.headers.referer ||req.originalUrl || '.')
	res.sendStatus(500)
})

module.exports = routes