const express = require('express')
const routes = express.Router()
const { render } = require('@modules/helpers')
const db = require('@modules/products/database')
module.exports = routes

routes.get('/', db.getAll, render('home', 'Início'))