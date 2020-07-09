const express = require('express')
const routes = express.Router()
const Produto = require('../models/Produto')
const { body, param, validationResult } = require('express-validator')
const validators = require('../helpers/validators')
const Pedido = require('../models/Pedido')

routes.get('/', async (req, res) => {
	const produtos = await Produto.findAll() // *todo adicionar catch
	res.render('pages/admin/products', {
		_page: 'products',
		_title: 'Produto',
		produtos: produtos
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
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
		})
		return res.redirect('/admin/products')
	}

	const product = await Produto.findOne({ where: { id: req.params.id } }).catch(err => {
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
		req.flash('error_msg', 'O usuário não foi encontrado')
		res.redirect('/admin/products')
	}
})


routes.post('/new', [
	body('name').notEmpty().trim().withMessage('Digite um nome'),
	body('description').optional({ checkFalsy: true }).trim(),
	body('price').notEmpty().withMessage('Digite um preço').bail().isDecimal().withMessage('Preço inválido'),
	body('image').optional({ checkFalsy: true }).isURL().withMessage('Imagem inválida'),
	body('stock').notEmpty().withMessage('Digite a quantidade em estoque').bail().isInt().withMessage('Estoque inválido'),
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
			req.flash('data', req.body)
		})
		return res.redirect('/admin/products/new')
	}

	await Produto.create({
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

	req.flash('success_msg', `Produto ${req.body.name} adicionado com sucesso`)
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
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
			req.flash('data', req.body)
		})
		return res.redirect(`/admin/products/edit/${req.body.id}`)
	}

	const product = await Produto.findOne({ where: { id: req.body.id } }).catch(err => {
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
		throw 'Produto não encontrado'
	}

	req.flash('success_msg', 'Editado com sucesso')
	res.redirect('/admin/products')
})

routes.post('/remove', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findProduct) // >> corrigir custom()
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
		})
		return res.redirect('/admin/products')
	}

		// destrói todos os pedidos referentes ao produto (necessário)
	await Pedido.destroy({ where: { produtoId: req.body.id } })
	await Produto.destroy({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir produto')
		res.redirect('/admin/products')
		throw err
	})

	req.flash('success_msg', 'Produto excluído com sucesso')
	res.redirect('/admin/products')
})

module.exports = routes