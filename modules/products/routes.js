const express = require('express')
const routes = express.Router()
const { render } = require('../../helpers/helpers')
const { validate, validateParam, schema } = require('./validators')
const actions = require('./database')

routes.get('/view/:id',
	validateParam(schema.get, 'id', false, {title: 'Produto não encontrado', message: 'Talvez ele tenha sido excluído ou o link está incorreto'}),
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((product) => {
			req.data.product = product
			if (!product) return next({notFound:true})
			next()
		}).catch(next)
	},
	render('product', 'Produto')
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
	render('products', 'Produtos')
)

routes.get('/add',
	render('product-edit', 'Adicionar produto')
)

routes.get('/edit/:id',
	validate(schema.get),
	(req, res, next) => {
		actions.get({ id: req.params.id }).then((product) => {
			req.data.product = product
			next()
		}).catch(next)
	},
	render('product-edit', 'Editar produto')
)


routes.post('/add',
	validate(schema.add),
	(req, res) => {
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
		}
	)
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

routes.use((err, req, res, next) => {
	// renderizar página de produto não encontrado aqui
})

module.exports = routes