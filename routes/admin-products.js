const express = require('express')
const routes = express.Router()
const Product = require('../models/Product')
const { body, param, validationResult } = require('express-validator')
const validators = require('../helpers/validators')
const Request = require('../models/Request')
const check = require('../helpers/checks')
const validate = check.validate

routes.get('/', async (req, res) => {
	const products = await Product.findAll() // *todo adicionar catch
	res.render('pages/admin/products', {
		_page: 'products',
		_title: 'Product',
		products
	})
})

routes.get('/new', (req, res) => {
	res.render('pages/admin/product-new', {
		_page: 'product-new',
		_title: 'Novo produto'
	})
})

routes.get('/edit/:id', [
	param('id').isInt().withMessage('ID inválido')
], validate('/admin/products'), async (req, res) => {

	const product = await Product.findOne({ where: { id: req.params.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro interno')
		res.redirect('/admin/products')
		throw err
	})

	if (product) {
		res.render('pages/admin/product-edit', {
			_page: 'product-edit',
			_title: `Atualizar ${product.name}`,
			product
		})
	} else {
		req.flash('error_msg', 'O produto não foi encontrado')
		res.redirect('/admin/products')
	}
})


routes.post('/new', [
	body('name').notEmpty().trim().withMessage('Digite um nome'),
	body('description').optional({ checkFalsy: true }).trim(),
	body('price').notEmpty().withMessage('Digite um preço').bail().isDecimal().withMessage('Preço inválido'),
	body('image').optional({ checkFalsy: true }).isURL().withMessage('Imagem inválida'),
	body('stock').notEmpty().withMessage('Digite a quantidade em estoque').bail().isInt().withMessage('Estoque inválido'),
], validate('/admin/products/new'), async (req, res) => {

	await Product.create({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		image: req.body.image,
		stock: req.body.stock,
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao criar produto')
		req.flash('data', req.body)
		res.redirect('/admin/products/new')
		throw err
	})

	req.flash('success_msg', `Product ${req.body.name} adicionado com sucesso`)
	return res.redirect('/admin/products')
})

// >> trocar update para edit
routes.post('/edit', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findProduct),
	body('name').optional({ checkFalsy: true }),
	body('description').optional().if(body('description').notEmpty()),
	body('price').optional({ checkFalsy: true }).isDecimal().withMessage('Preço inválido'),
	body('image').optional().if(body('image').notEmpty()).isURL().withMessage('Imagem inválida'),
	body('stock').optional({ checkFalsy: true }).isInt().withMessage('Estoque inválido'),
	// >> validar
], async (req, res) => {
	if (!check.isValid(req, res)) return res.redirect(`/admin/products/edit/${req.body.id || 0}`)

	const product = await Product.findOne({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar produto')
		req.flash('data', req.body)
		res.redirect(`/admin/products/edit/${req.body.id}`)
		throw err
	})

	if (product) {
		await product.update({
			// >> adicionar detalhes
			name: req.body.name || undefined,
			description: (req.body.description == '' ? '' : (req.body.description || undefined)),
			price: req.body.price || undefined,
			image: (req.body.image == '' ? '' : (req.body.image || undefined)),
			stock: req.body.stock || undefined,
		}).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao editar produto')
			req.flash('data', req.body)
			res.redirect(`/admin/products/edit/${req.body.id}`)
			throw err
		})
	} else {
		req.flash('error_msg', 'O produto não foi encontrado')
		res.redirect('/admin/products')
		throw 'Product não encontrado'
	}

	req.flash('success_msg', 'Editado com sucesso')
	res.redirect('/admin/products')
})

routes.post('/remove', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findProduct) // >> corrigir custom()
], validate('/admin/products'), async (req, res) => {

	// >> destrói todos os pedidos referentes ao produto (necessário)
	await Request.destroy({ where: { produtoId: req.body.id } })
	await Product.destroy({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir produto')
		res.redirect('/admin/products')
		throw err
	})

	req.flash('success_msg', 'Product excluído com sucesso')
	res.redirect('/admin/products')
})

module.exports = routes