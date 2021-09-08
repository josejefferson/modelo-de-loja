const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')

routes.get('/:id', g,
	async (req, res, next) => {
		actions.get({ id: req.params.id }).then((image) => {
			req.data.image = image
			next()
		})
	},
	async (req, res) => {
		res.contentType(req.data.image)
		res.send(req.data.image)
	}
)

module.exports = routes