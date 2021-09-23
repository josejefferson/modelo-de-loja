const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const { actions } = require('./database')

routes.get('/', (req, res, next) => {
	actions.getAll().then((requests) => {
		req.data.requests = requests
		next()
	})
}, render(__dirname + '/main', 'Pedidos'))

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
		Promise.all(promises).then(next)
	},
	render('history', 'Histórico de compras')
)


routes.post('/cancel/:id',
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((request) => {
			//validate
			actions.remove({ id: req.params.id }).then(next)
		}).catch(next)
	},
	(req, res, next) => {
		res.json({ success: true })
		next()
	}
)

module.exports = routes