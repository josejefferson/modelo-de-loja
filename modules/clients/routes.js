const express = require('express')
const routes = express.Router()
const { render } = require('@modules/helpers')
const db = require('./database')
const { validate } = require('./validators')
const { admin } = require('@modules/restrictions')
module.exports = routes

routes.get('/', db.getMine, render('clients', 'Clientes'))
routes.get('/add', render('client-edit', 'Adicionar cliente'))
routes.get('/edit/:id', validate.id, db.get, render('client-edit', 'Editar cliente'))
routes.post('/add', /*validate.add,*/ db.add)
routes.post('/edit/:id', validate.id, /*validate.edit,*/ db.edit)
routes.get('/email/confirm/:token', db.validateEmail)
routes.get('/email/unsubscribe/:id', db.unsubscribeEmail)
routes.get('/email/unconfirm/:id', db.unconfirmEmail)
routes.get('/email/resend/:id', db.resendEmail)
routes.use(admin)
routes.get('/all', db.getAll, render('clients-all', 'Todos os clientes'))
routes.get('/remove/:id', validate.id, db.remove)