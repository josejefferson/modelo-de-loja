const express = require('express')
const routes = express.Router()
const { admin: adm, auth, notAuth } = require('../helpers/middlewares')
const valid = require('../helpers/validators2')
const render = require('../helpers/renders')
const {
	cart,
	products,
	product,
	users,
	cartProds,
	user,
	admins,
	admin,
	requests,
	moment
} = require('../helpers/getters')
const acts = require('../helpers/actions')

// Rotas públicas
routes.get('/', cart, products, render('home', 'Início'))
routes.get('/product/:id', cart, product, render('product', 'Produto'))
routes.get('/buy/:id', product, users, render('buy', 'Comprar'))
routes.get('/cart', cart, cartProds, users, render('cart', 'Carrinho'))
routes.get('/users', users, render('users', 'Usuários'))
routes.get('/users/add', render('users-add', 'Adicionar usuário'))
routes.get('/users/edit/:id', user, render('users-add', 'Editar usuário'))
routes.get('/login', notAuth, render('login', 'Painel do administrador'))

routes.post('/buy', valid.buy, acts.buy)
routes.post('/cart', valid.cart, acts.cart)
routes.post('/users/add', valid.usersAdd, acts.addUser)
routes.post('/users/edit', valid.usersEdit, acts.editUser)
routes.post('/login', valid.login, acts.login)
routes.all('/logout', auth, acts.logout)

// Rotas do administrador
routes.get('/admins', /*adm,*/admins, render('admin/users', 'Administradores'))
routes.get('/admins/add', /*adm,*/ render('admin/signup', 'Adicionar administrador'))
routes.get('/admins/edit/:id', /*adm,*/admin, render('admin/signup', 'Editar administrador'))
routes.get('/products', /*adm,*/ cart, products, render('admin/products', 'Produtos'))
routes.get('/products/add', /*adm,*/ render('admin/product-new', 'Adicionar produto'))
routes.get('/products/edit/:id', /*adm,*/ product, render('admin/product-new', 'Editar produto'))
routes.get('/requests', /*adm,*/ requests, moment, render('admin/requests', 'Pedidos'))

routes.post('/admins/add', /*adm,*/ valid.adminsAdd, acts.addAdmin)
routes.post('/admins/edit', /*adm,*/ valid.adminsEdit, acts.editAdmin)
routes.post('/admins/remove', /*adm,*/ valid.adminsRemove, acts.removeAdmin)
routes.post('/products/add', /*adm,*/ valid.productsAdd, acts.addProduct)
routes.post('/products/edit', /*adm,*/ valid.productsEdit, acts.editProduct)
routes.post('/products/remove', /*adm,*/ valid.productsRemove, acts.removeProduct)
routes.post('/requests/confirm', /*adm,*/ valid.requestsConfirm, acts.confirmRequest)

module.exports = routes