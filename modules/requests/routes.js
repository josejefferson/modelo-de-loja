const express = require('express')
const routes = express.Router()
const { render } = require('@modules/helpers')
const db = require('./database')
const socket = require('./sockets')
const email = require('./email')
const clientActions = require('@modules/clients/database')
const productActions = require('@modules/products/database')
const { validate } = require('@modules/validators')
module.exports = routes

routes.get('/', db.getAll, render('requests', 'Pedidos'))
routes.get('/my', db.getMine, render('my-requests', 'Histórico de compras'))
routes.post('/cancel/:id', db.get, db.cancel, email.cancel)
routes.post('/confirm/:id', db.get, db.confirm, socket.confirm, email.confirm)
routes.get('/buy/:id', validate.id, clientActions.getMineToBuy, productActions.get, render('buy', 'Comprar'))
routes.post('/buy', clientActions.getBody, db.buy, socket.buy, email.buy)