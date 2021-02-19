const express = require('express')
const routes = express.Router()
const { admin: adm, auth, notAuth } = require('./middlewares')
const valid = require('./validators')
const { render } = require('./helpers')
const get = require('./getters')
const acts = require('./actions')

// Rotas públicas
routes.get('/', get.cart, get.products, render('home', 'Início'))
routes.get('/product/:id', get.cart, get.product, render('product', 'Produto'))
routes.get('/buy/:id', get.product, get.users, render('buy', 'Comprar'))
routes.get('/cart', get.cart, get.cartProds, get.users, render('cart', 'Carrinho'))
routes.get('/users', get.users, render('users', 'Usuários'))
routes.get('/users/add', render('usersEdit', 'Adicionar usuário'))
routes.get('/users/edit/:id', get.user, render('usersEdit', 'Editar usuário'))
routes.get('/history', /****/ render('history', 'Histórico de compras'))
routes.get('/login', notAuth, render('login', 'Painel do administrador'))

routes.post('/buy/:id', valid.buy, acts.buy)
routes.post('/cart', valid.cart, acts.cart)
routes.post('/users/add', valid.usersAdd, acts.addUser)
routes.post('/users/edit/:id', valid.usersEdit, acts.editUser)
routes.post('/login', valid.login, acts.login)
routes.all('/logout', auth, acts.logout)

// Rotas do administrador
routes.get('/admins', /*adm,*/get.admins, render('admin/admins', 'Administradores'))
routes.get('/admins/add', /*adm,*/ render('admin/adminsEdit', 'Adicionar administrador'))
routes.get('/admins/edit/:id', /*adm,*/get.admin, render('admin/adminsEdit', 'Editar administrador'))
routes.get('/products', /*adm,*/ get.cart, get.products, render('admin/products', 'Produtos'))
routes.get('/products/add', /*adm,*/ render('admin/productsEdit', 'Adicionar produto'))
routes.get('/products/edit/:id', /*adm,*/ get.product, render('admin/productsEdit', 'Editar produto'))
routes.get('/requests', /*adm,*/ get.requests, get.moment, render('admin/requests', 'Pedidos'))

routes.post('/admins/add', /*adm,*/ valid.adminsAdd, acts.addAdmin)
routes.post('/admins/edit/:id', /*adm,*/ valid.adminsEdit, acts.editAdmin)
routes.get('/admins/remove/:id', /*adm,*/ valid.adminsRemove, acts.removeAdmin)
routes.post('/products/add', /*adm,*/ valid.productsAdd, acts.addProduct)
routes.post('/products/edit/:id', /*adm,*/ valid.productsEdit, acts.editProduct)
routes.get('/products/remove/:id', /*adm,*/ valid.productsRemove, acts.removeProduct)
routes.post('/requests/confirm/:id', /*adm,*/ valid.requestsConfirm, acts.confirmRequest)

module.exports = routes