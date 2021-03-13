const express = require('express')
const routes = express.Router()
const { admin: adm, auth, notAuth } = require('./middlewares')
const valid = require('./validators')
const { render, g } = require('./helpers')
const get = require('./getters')

module.exports = io => {
	const acts = require('./actions')(io)
	
	// Rotas públicas
	routes.get('/', g, get.products, render('home', 'Início'))
	routes.get('/product/:id', g, get.cart, get.product, render('product', 'Produto'))
	routes.get('/buy/:id', g, get.product, get.users, render('buy', 'Comprar'))
	routes.get('/cart', g, get.cart, get.cartProds, get.users, render('buy', 'Carrinho'))
	routes.get('/users', g, get.users, render('users', 'Usuários'))
	routes.get('/users/add', render('usersEdit', 'Adicionar usuário'))
	routes.get('/users/edit/:id', g, get.user, render('usersEdit', 'Editar usuário'))
	routes.get('/history', g, get.myRequests, render('history', 'Histórico de compras'))
	routes.get('/login', notAuth, render('login', 'Painel do administrador'))
	routes.get('/images/:id', g, get.image, acts.showImage)
	
	routes.post('/buy', valid.buy, acts.buy)
	routes.post('/requests/cancel/:id', valid.cancelReq, acts.cancelReq)
	routes.post('/cart', valid.cart, acts.cart)
	routes.post('/users/add', valid.usersAdd, acts.addUser)
	routes.post('/users/edit/:id', valid.usersEdit, acts.editUser)
	routes.post('/login', valid.login, acts.login)
	routes.all('/logout', auth, acts.logout)
	
	// Rotas do administrador
	routes.get('/products', /*adm,*/ g, get.cart, get.allProducts, render('admin/products', 'Produtos'))
	routes.get('/products/add', /*adm,*/ render('admin/productsEdit', 'Adicionar produto'))
	routes.get('/products/edit/:id', /*adm,*/ g, get.product, render('admin/productsEdit', 'Editar produto'))
	routes.get('/requests', /*adm,*/ g, get.requests, get.moment, render('admin/requests', 'Pedidos'))
	routes.get('/highlights', /*adm, */ render('admin/highlights', 'Destaques'))
	routes.get('/ads', /*adm, */ render('admin/ads', 'Anúncios'))
	routes.get('/admins', /*adm,*/ g, get.admins, render('admin/admins', 'Administradores'))
	routes.get('/admins/add', /*adm,*/ render('admin/adminsEdit', 'Adicionar administrador'))
	routes.get('/admins/edit/:id', /*adm,*/ g, get.admin, render('admin/adminsEdit', 'Editar administrador'))
	routes.get('/images', /*adm,*/ g, get.images, render('admin/images', 'Imagens'))
	routes.get('/json/images', /*adm, */ g, get.images, acts.json)
	
	routes.post('/admins/add', /*adm,*/ valid.adminsAdd, acts.addAdmin)
	routes.post('/admins/edit/:id', /*adm,*/ valid.adminsEdit, acts.editAdmin)
	routes.get('/admins/remove/:id', /*adm,*/ valid.adminsRemove, acts.removeAdmin)
	routes.post('/products/add', /*adm,*/ valid.productsAdd, acts.addProduct)
	routes.post('/products/edit/:id', /*adm,*/ valid.productsEdit, acts.editProduct)
	routes.get('/products/remove/:id', /*adm,*/ valid.productsRemove, acts.removeProduct)
	routes.post('/requests/confirm/:id', /*adm,*/ valid.requestsConfirm, acts.confirmRequest)
	routes.post('/images/upload', acts.upload, acts.uploadImg)
	routes.get('/images/remove/:id', acts.removeImage)
	
	return routes
}