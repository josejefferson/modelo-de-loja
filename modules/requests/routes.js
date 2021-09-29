const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const actions = require('./database')
const productActions = require('../products/database')
const { requests: socketRequest, history: socketHistory} = require('./sockets')

routes.get('/', (req, res, next) => {
	actions.getAll().then((requests) => {
		req.data.requests = requests
		next()
	})
}, render('requests', 'Pedidos'))

routes.get('/my',
	(req, res, next) => {
		req.data.myRequests = {}
		const promises = req.data.userIDs.map((userID) => {
			return actions.getAllFromClient({ clientID: userID }).then((requests) => {
				requests.reverse()
				req.data.myRequests[userID] = requests
			}).catch((err) => {
				req.data.myRequests[userID] = []
			})
		})
		Promise.all(promises).then((requests) => {
			next()
		}).catch(next)
	},
	render('my-requests', 'Histórico de compras')
)


routes.post('/cancel/:id',
	(req, res, next) => {
		actions.remove({ id: req.params.id })
			.then(() => next())
			.catch(next)
	},
	(req, res, next) => {
		res.json({ success: true })
		// next()
	}
)

routes.post('/confirm/:id',
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((request) => {
			req.data.request = request
			next()
		})
	},
	(req, res, next) => {
		productActions.get({ id: req.data.request.productId }).then((product) => {
			req.data.product = product
			next()
		})
	},
	(req, res, next) => {
		const request = req.data.request
		const product = req.data.product

		switch (req.body.confirm) {
			case 'confirm':
				request.status = 'confirmed'
				product.stock = product.stock > 0 ? product.stock - request.quantity : product.stock < 0 ? -1 : 0
				product.save()
				break

			case 'reject':
				request.status = 'rejected'
				break

			case 'done':
				if (request.status === 'pending')
					request.status = 'confirmed'
				request.open = false
				break

			case 'feedback':
				request.feedback = req.body.feedback
				break

			case 'reset': // TODO: REMOVER NO FUTURO
				request.status = 'pending'
				request.open = true
				request.feedback = undefined
				break

			case 'delete':
				request.remove()
				break
		}
		request.save().then(() => next())

		req.data.request = request
	},
	(req, res, next) => {
		res.json({ success: true })
		const request = req.data.request
		socketHistory.to(request.clientId._id.toString()).emit('confirm', {
			clientId: request.clientId._id,
			requestId: request._id,
			action: req.body.confirm,
			...(req.body.feedback && { feedback: req.body.feedback })
		})
		// next()
	},
)


module.exports = routes