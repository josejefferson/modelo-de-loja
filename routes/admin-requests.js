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
	// >> ao confirmar, diminuir do estoque
	const request = await Pedidos.findOne({ where: { id: req.body.id } }) // ** trocar findAll por findOne em algumas situações
	const product = await Produtos.findOne({ where: { id: request.product } })

	if (req.body.confirm) await product.update({
		stock: product.stock ? product.stock - 1 : 0
	})

	await request.update({
		pending: false,
		confirmed: req.body.confirm
	})
	
	res.json({ success: true })
})

module.exports = routes