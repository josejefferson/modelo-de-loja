const express = require('express')
const routes = express.Router()
const { render } = require('@modules/helpers')
const { validate } = require('./validators')
const db = require('./database')

routes.get('/view/:id', validate.id, db.get, render('product', 'Produto'))
routes.get('/rate/:id/:client/:rating', validate.id, validate.rate, db.rate) // temporariamente get
// routes.use(admin)
routes.get('/', db.getALL, render('products', 'Produtos'))
routes.get('/add', render('product-edit', 'Adicionar produto'))
routes.get('/edit/:id', validate.id, db.get, render('product-edit', 'Editar produto'))
routes.post('/add', validate.add, db.add)
routes.post('/edit/:id', validate.id, validate.edit, db.edit)
routes.get('/remove/:id', validate.id, db.remove)

module.exports = routes