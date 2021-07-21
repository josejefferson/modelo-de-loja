const express = require('express')
const routes = express.Router()
const { render, g } = require('../../helpers/helpers')

routes.get('/images/:id', g, get.image, acts.showImage)

module.exports = routes