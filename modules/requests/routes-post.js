const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')
const actions = require('./db-actions')

routes.use((req, res, next) => {
	const userIDs = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
	req.data.userIDs = userIDs
	next()
})

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