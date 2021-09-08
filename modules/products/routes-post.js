const express = require('express')
const routes = express.Router()
const actions = require('./db-actions')

// routes.use(adm)
routes.post('/add', valid.productsAdd, (req, res) => {
	actions.add({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		oldprice: req.body.oldprice,
		badge: req.body.badge,
		image: req.body.image,
		media: req.body.media,
		stock: req.body.stock,
		hidden: req.body.hidden
	}).then(() => {
		req.flash('success_msg', `Produto "${req.body.name}" adicionado com sucesso`)
		return res.redirect(req.query.r || '/products')
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao criar produto')
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/products/add')
	})
})

routes.post('/edit/:id', valid.productsEdit, (req, res) => {
	actions.add().then(() => {
		req.flash('success_msg', `Produto "${product.name}" editado com sucesso`)
		res.redirect(req.query.r || '/products')
	}).catch(err => {
		req.flash('error_msg', err.message || 'Ocorreu um erro desconhecido ao procurar produto')
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/products/edit/${req.params.id}`)
	})
})

routes.get('/remove/:id', valid.productsRemove, (req, res) => {
	actions.remove({
		id: req.params.id
	}).then(() => {
		req.flash('success_msg', 'Produto excluído com sucesso')
		res.redirect(req.query.r || '/products')
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir produto')
		res.redirect(req.query.r || '/products')
	})
})