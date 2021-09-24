const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const { actions } = require('./database')

routes.get('/view/:id',
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((product) => {
			req.data.product = product
			next()
		}).catch(next)
	},
	render(__dirname + '/product', 'Produto')
)

// routes.use(adm)
routes.get('/',
	(req, res, next) => {
		actions.getAll().then((products) => {
			req.data.products = products
			req.data.products.reverse().sort((a, b) => {
				return b.stock === 0 ? -1 : 0
			})
			next()
		}).catch(next)
	},
	render(__dirname + '/products', 'Produtos')
)

routes.get('/add',
	render(__dirname + '/productEdit', 'Adicionar produto')
)

routes.get('/edit/:id',
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((product) => {
			req.data.product = product
			next()
		}).catch(next)
	},
	render(__dirname + '/productEdit', 'Editar produto')
)


routes.post('/add', (req, res) => {
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
		req.flash('successMsg', `Produto "${req.body.name}" adicionado com sucesso`)
		return res.redirect(req.query.r || '/products')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao criar produto')
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/products/add')
	})
})

routes.post('/edit/:id', (req, res) => {
	actions.edit({
		id: req.params.id,
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
		req.flash('successMsg', `Produto "${req.body.name}" editado com sucesso`)
		res.redirect(req.query.r || '/products')
	}).catch((err) => {
		req.flash('errorMsg', err.message || 'Ocorreu um erro desconhecido ao procurar produto')
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/products/edit/${req.params.id}`)
	})
})

routes.get('/remove/:id', (req, res) => {
	actions.remove({
		id: req.params.id
	}).then(() => {
		req.flash('successMsg', 'Produto excluído com sucesso')
		res.redirect(req.query.r || '/products')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir produto')
		res.redirect(req.query.r || '/products')
	})
})

module.exports = routes