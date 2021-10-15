const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const db = require('./database')
const clientActions = require('../clients/database')
const productActions = require('../products/database')
const { validate } = require('../validators')
const socket = require('./sockets')
module.exports = routes

routes.get('/', db.getAll, render('requests', 'Pedidos'))
routes.get('/my', db.getMine, render('my-requests', 'Histórico de compras'))
routes.post('/cancel/:id', db.get, db.cancel)
routes.post('/confirm/:id', db.get, db.confirm, socket.confirm)
routes.get('/buy/:id', validate.id, clientActions.getMineToBuy, productActions.get, render('buy', 'Comprar'))
routes.post('/buy', clientActions.getBody, db.buy, socket.buy)

module.exports = routes