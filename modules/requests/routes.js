const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const {actions} = require('./database')

routes.use((req, res, next) => {
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.userIDs = userIDs
	next()
})

routes.get('/history', g,
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


routes.post('/requests/cancel/:id', g,
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((request) => {
			//validate
			actions.remove({ id: req.params.id }).then(next)
		})
	},
	(req, res, next) => {
		res.json({ success: true })
		next()
	}
)

module.exports = routes