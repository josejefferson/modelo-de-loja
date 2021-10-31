const express = require('express')
const routes = express.Router()
const { render } = require('@helpers/helpers')
const db = require('./database')
module.exports = routes

routes.get('/', db.getAll, render('images', 'Imagens'))
routes.get('/api', db.getAll, db.jsonAll)
routes.get('/view/:id', db.get, db.render)
// admin
routes.post('/upload', db.upload)
routes.get('/remove/:id', db.remove)