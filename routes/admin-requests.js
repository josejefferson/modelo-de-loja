const express = require('express')
const routes = express.Router()
const Product = require('../models/Product')
const { body, param, validationResult } = require('express-validator')
const validators = require('../helpers/validators')
const Request = require('../models/Request')
const { Op } = require('sequelize')
const moment = require('moment')
const Client = require('../models/Client')

routes.get('/', async (req, res) => {

	// pending: true OR (pending: false AND confirmed: true AND done: false)
	const requests = await Request.findAll({
		where: {
			[Op.or]: [
				{ pending: true },
				{
					[Op.and]: [{ pending: false }, { confirmed: true }, { done: false }]
				}
			],
		},
		include: [{ model: Product }, { model: Client }]
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
	const request = await Request.findOne({
		where: { id: req.body.id },
	}) // ** trocar findAll por findOne em algumas situações
	const product = await Product.findOne({ where: { id: request.productId } })

	switch (req.body.confirm) {
		case 'confirm':
			await request.update({
				pending: false,
				confirmed: true
			})
			await product.update({
				stock: product.stock ? product.stock - request.quantity : 0
			})
			break;
		
		case 'reject':
			await request.update({
				pending: false,
				confirmed: false
			})
			break;
		
		case 'done':
			await request.update({
				pending: false,
				confirmed: true,
				done: true
			})
			break;
	}

	res.json({ success: true })
})

module.exports = routes