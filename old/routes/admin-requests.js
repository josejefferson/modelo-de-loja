const express = require('express')
const routes = express.Router()
const Product = require('../models/Product')
const Request = require('../models/Request')
const moment = require('moment')

routes.get('/', async (req, res) => {

	// pending: true OR (pending: false AND confirmed: true AND done: false)
	const requests = await Request.find({
		$or: [
			{ pending: true },
			{ $and: [{ pending: false }, { confirmed: true }, { done: false }] }
		],
	}).populate('productId').populate('clientId')

	res.render('pages/admin/requests', {
		_page: 'requests',
		_title: 'Pedidos',
		requests,
		moment
	})
})

routes.post('/confirm', async (req, res) => {
	// >> ao confirmar, diminuir do estoque
	const request = await Request.findOne({ _id: req.body.id }) // ** trocar find por findOne em algumas situações
	const product = await Product.findOne({ _id: request.productId })

	switch (req.body.confirm) {
		case 'confirm':
			request.pending = false
			request.confirmed = true
			product.stock = product.stock > 0 ? product.stock - request.quantity : product.stock < 0 ? -1 : 0
			await request.save()
			await product.save()
			break;

		case 'reject':
			request.pending = false
			request.confirmed = false
			await request.save()
			break;

		case 'done':

			request.pending = false
			request.confirmed = true
			request.done = true
			await request.save()
	}

	res.json({ success: true })
})

module.exports = routes