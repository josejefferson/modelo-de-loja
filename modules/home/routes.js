const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const { actions } = require('../products/database')

// GET
routes.get('/',
	async (req, res, next) => {
		actions.getAll().then((products) => {
			req.data.products = products
			next()
		}).catch(next)
	},
	render(__dirname + '/main', 'Início')
)

module.exports = routes