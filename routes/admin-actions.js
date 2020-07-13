const express = require('express')
const routes = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const validators = require('../helpers/validators')
const bcrypt = require('bcryptjs')
const check = require('../helpers/checks')
const validate = check.validate

routes.post('/signup', [
	body('name').notEmpty().trim().withMessage('Digite seu nome'),
	body('email').notEmpty().trim().withMessage('Digite seu e-mail').bail().isEmail().withMessage('E-mail inválido')
		.bail().custom(validators.findEmail),
	body('password').notEmpty().withMessage('Digite uma senha').bail().custom(validators.comparePasswords)
], validate(), async (req, res) => {

	// Cria o usuário
	await User.create({
		name: req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		admin: true
	}).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao criar usuário')
		req.flash('data', req.body)
		res.redirect('signup')
		throw err
	})

	req.flash('success_msg', `Usuário ${req.body.name} criado com sucesso`)
	if (req.user && req.user.admin) return res.redirect('users')
	return res.redirect('/admin')
})

// routes.post('/products/edit', [
// 	// body('id').isInt().withMessage('Id inválido').bail().custom(validators.findUser),
// 	// body('email').optional({ checkFalsy: true }).isEmail().withMessage('E-mail inválido').bail().custom(validators.findEmail),
// 	// body('password').optional({ checkFalsy: true }).custom(validators.comparePasswords)
// 	// >> validar
// ], async (req, res) => {

// 	// if (check.isValid(req, res)) return res.redirect(`products/edit/${req.body.id}`) // >> testar

// 	// Procura o usuário
// 	const product = await Product.findOne({ where: { id: req.body.id } }).catch(err => {
// 		req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar produto')
// 		req.flash('data', req.body)
// 		res.redirect(`product/update/${req.body.id}`)
// 		throw err
// 	})

// 	if (product) {
// 		// Atualiza dados do usuário
// 		await product.update({
// 			// >> adicionar detalhes
// 			// name: req.body.name || undefined,
// 			// email: req.body.email || undefined,
// 			// password: bcrypt.hashSync(req.body.password, 10) || undefined
// 		}).catch(err => {
// 			req.flash('error_msg', 'Ocorreu um erro desconhecido ao editar produto')
// 			req.flash('data', req.body)
// 			res.redirect(`product/update/${req.body.id}`)
// 			throw err
// 		})
// 	} else {
// 		// Caso o usuário não exista
// 		req.flash('error_msg', 'O produto não foi encontrado')
// 		res.redirect('products')
// 		throw 'Product não encontrado'
// 	}

// 	req.flash('success_msg', 'Editado com sucesso')
// 	res.redirect('products')
// })

routes.post('/product/remove', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findUser) // >> corrigir custom()
], validate('/admin/products'), async (req, res) => {

	// >> Remove usuários
	await Product.destroy({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir produtp')
		res.redirect('products')
		throw err
	})

	req.flash('success_msg', 'Product excluído com sucesso')
	res.redirect('/admin/products')
})

routes.post('/update', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findUser),
	body('email').optional({ checkFalsy: true }).isEmail().withMessage('E-mail inválido').bail().custom(validators.findEmail),
	body('password').optional({ checkFalsy: true }).custom(validators.comparePasswords)
], async (req, res) => {

	if (!check.isValid(req, res)) return res.redirect(`update/${req.body.id}`)

	// Procura o usuário
	const user = await User.findOne({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar usuário')
		req.flash('data', req.body)
		res.redirect(`update/${req.body.id}`)
		throw err
	})

	if (user) {
		// Atualiza dados do usuário
		await user.update({
			name: req.body.name || undefined,
			email: req.body.email || undefined,
			password: bcrypt.hashSync(req.body.password, 10) || undefined
		}).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao editar usuário')
			req.flash('data', req.body)
			res.redirect(`update/${req.body.id}`)
			throw err
		})
	} else {
		// Caso o usuário não exista
		req.flash('error_msg', 'O usuário não foi encontrado')
		res.redirect('users')
		throw 'Usuário não encontrado'
	}

	req.flash('success_msg', 'Editado com sucesso')
	res.redirect('users')
})

routes.post('/remove', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findUser)
], validate('users'), async (req, res) => {

	// Remove usuários
	await User.destroy({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir usuário')
		res.redirect('users')
		throw err
	})

	req.flash('success_msg', 'Usuário excluído com sucesso')
	res.redirect('users')
})

module.exports = routes