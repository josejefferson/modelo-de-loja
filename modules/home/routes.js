const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const db = require('../products/database')

routes.get('/', db.getAll, render('home', 'Início'))

module.exports = routes