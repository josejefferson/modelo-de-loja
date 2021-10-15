const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const db = require('./database')
const { validate } = require('./validators')
const { admin } = require('../restrictions')
module.exports = routes

routes.get('/', db.getMine, render('clients', 'Clientes'))
routes.get('/add', render('client-edit', 'Adicionar cliente'))
routes.get('/edit/:id', validate.id, db.get, render('client-edit', 'Editar cliente'))
routes.post('/add', /*validate.add,*/ db.add)
routes.post('/edit/:id', validate.id, /*validate.edit,*/ db.edit)
// routes.use(admin)
routes.get('/all', db.getAll, render('clients-all', 'Todos os clientes'))
routes.get('/remove/:id', validate.id, db.remove)