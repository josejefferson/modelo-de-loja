const express = require('express')
const routes = express.Router()
const { render } = require('../helpers/helpers')
const clientActions = require('./clients/database')
const requestActions = require('./requests/database')
const productActions = require('./products/database')
const { requests: socket } = require('./requests/sockets')

routes.get('/:id',
	productActions.get,
	clientActions.getMine,
	render('buy', 'Comprar')
)

routes.post('/',
	clientActions.getBody,
	async (req, res, next) => {
		const requests = []
		for (const product of req.body.products) {
			const request = await requestActions.add({
				clientID: req.data.clientUser._id,
				productID: product.id,
				quantity: product.quantity,
				other: req.body.other
			}).catch(next)

			requests.push(await request.populate('clientId'))
		}
		socket.emit('newRequests', { clientId: req.data.clientUser._id, requests }) // enviar informações completas do cliente
		req.data.requests = requests
		res.redirect('/requests/my')
	},
	// Socket
)

module.exports = routes