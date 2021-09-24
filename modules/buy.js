const express = require('express')
const routes = express.Router()
const { render } = require('../helpers/helpers')
const { actions: clientActions } = require('./clients/database')
const { actions: requestActions } = require('./requests/database')
const { actions: productActions } = require('./products/database')

routes.get('/:id',
	(req, res, next) => {
		productActions.get({ id: req.params.id }).then((product) => {
			req.data.product = product
			next()
		}).catch(next)
	}, (req, res, next) => {
		clientActions.getMultiple({ ids: req.data.userIDs }).then((users) => {
			req.data.users = users
			// redirecionar se não houver usuários
			next()
		}).catch(next)
	}, render(__dirname + '/cart/main', 'Carrinho')
)


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
		res.redirect('/requests/my')
		next()
	},
	// Socket
)

module.exports = routes