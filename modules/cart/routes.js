const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const actions = require('./database')
const clientActions = require('../clients/database')
module.exports = routes

routes.get('/', actions.get, clientActions.getMine, render('buy', 'Carrinho'))