const express = require('express')
const routes = express.Router()
const actions = require('./db-actions')

routes.post('/products/add', /*adm,*/ valid.productsAdd, (req, res) => {
	
})

routes.post('/products/edit/:id', /*adm,*/ valid.productsEdit, (req, res) => {
	
})

routes.get('/products/remove/:id', /*adm,*/ valid.productsRemove, (req, res) => {
	
})