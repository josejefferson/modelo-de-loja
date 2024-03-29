const express = require('express')
const routes = express.Router()
const { render } = require('@modules/helpers')
const actions = require('./database')
const clientActions = require('@modules/clients/database')
module.exports = routes

routes.get('/', actions.get, clientActions.getMine, render('buy', 'Carrinho'))