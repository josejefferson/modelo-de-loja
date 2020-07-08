const express = require('express')
const routes = express.Router()
const Produtos = require('../models/Produtos')
const { body, param, validationResult } = require('express-validator')
const validators = require('../helpers/validators')
const Pedidos = require('../models/Pedidos')

routes.get('/', async (req, res) => {

	const requests = await Pedidos.findAll({
		where: { pending: true }
	})

	res.render('pages/admin/requests', {
		_page: 'requests',
		_title: 'Pedidos',
		requests
	})
})

routes.post('/confirm', async (req, res) => {
	// req.body.id
	// req.body.confirm
	// Se req.body.confirm == true, confirmado, se não, não confirmado
	const request = await Pedidos.findOne({ where: { id: req.body.id } }) // ** trocar findAll por findOne em algumas situações
	await request.update({
		pending: false,
		confirmed: req.body.confirm
	})
	res.json({ success: true })
})

module.exports = routes