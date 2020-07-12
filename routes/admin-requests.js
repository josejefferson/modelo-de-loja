const express = require('express')
const routes = express.Router()
const Produto = require('../models/Produto')
const { body, param, validationResult } = require('express-validator')
const validators = require('../helpers/validators')
const Pedido = require('../models/Pedido')
const moment = require('moment')

routes.get('/', async (req, res) => {

	const requests = await Pedido.findAll({
		where: { pending: true },
		include: [{ model: Produto }] 
	})

	res.render('pages/admin/requests', {
		_page: 'requests',
		_title: 'Pedidos',
		requests,
		moment
	})
})

routes.post('/confirm', async (req, res) => {
	// >> ao confirmar, diminuir do estoque
	const request = await Pedido.findOne({
		where: { id: req.body.id },
	}) // ** trocar findAll por findOne em algumas situações
	const product = await Produto.findOne({ where: { id: request.produtoId } })

	if (req.body.confirm == "true") await product.update({
		stock: product.stock ? product.stock - 1 : 0
	})

	await request.update({
		pending: false,
		confirmed: req.body.confirm
	})
	
	res.json({ success: true })
})

module.exports = routes