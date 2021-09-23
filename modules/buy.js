const express = require('express')
const routes = express.Router()
const { render } = require('../helpers/helpers')
const { actions: clientActions } = require('./clients/database')
const { actions: requestActions } = require('./requests/database')

routes.get('/', (req, res, next) => {
	
})

routes.post('/',
	(req, res, next) => {
		clientActions.get({ id: req.body.user }).then((client) => { //mudar user > client
			req.data.client = client
			next()
		})
	},
	async (req, res, next) => {
		const requests = []
		for (const product of req.body.products) {
			const request = await requestActions.add({
				clientID: req.data.client._id,
				productID: product.id,
				quantity: product.quantity,
				other: req.body.other
			}).catch(next)

			requests.push(request)
		}
		req.data.requests = requests
		next()
	},
	// Socket
)

module.exports = routes