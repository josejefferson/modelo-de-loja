const express = require('express')
const routes = express.Router()
const Usuarios = require('../models/Usuarios')
const { body, validationResult } = require('express-validator')
const validators = require('../helpers/validators')
const bcrypt = require('bcryptjs')

routes.post('/signup', [
	body('name').notEmpty().trim().withMessage('Digite seu nome'),
	body('email').notEmpty().trim().withMessage('Digite seu e-mail').bail().isEmail().withMessage('E-mail inválido')
		.bail().custom(validators.findEmail),
	body('password').notEmpty().withMessage('Digite uma senha').bail().custom(validators.comparePasswords)
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
			req.flash('data', req.body)
		})
		return res.redirect(`signup`)
	}

	// Cria o usuário
	await Usuarios.create({
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

routes.post('/product/update', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findUser),
	// body('email').optional({ checkFalsy: true }).isEmail().withMessage('E-mail inválido').bail().custom(validators.findEmail),
	// body('password').optional({ checkFalsy: true }).custom(validators.comparePasswords)
	// >> validar
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
			req.flash('data', req.body)
		})
		return res.redirect(`product/update/${req.body.id}`)
	}

	// Procura o usuário
	const product = await Produtos.findOne({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar produto')
		req.flash('data', req.body)
		res.redirect(`product/update/${req.body.id}`)
		throw err
	})

	if (product) {
		// Atualiza dados do usuário
		await product.update({
			// >> adicionar detalhes
			// name: req.body.name || undefined,
			// email: req.body.email || undefined,
			// password: bcrypt.hashSync(req.body.password, 10) || undefined
		}).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao editar produto')
			req.flash('data', req.body)
			res.redirect(`product/update/${req.body.id}`)
			throw err
		})
	} else {
		// Caso o usuário não exista
		req.flash('error_msg', 'O produto não foi encontrado')
		res.redirect('products')
		throw 'Produto não encontrado'
	}

	req.flash('success_msg', 'Editado com sucesso')
	res.redirect('products')
})

routes.post('/product/remove', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findUser) // >> corrigir custom()
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
		})
		return res.redirect('/admin/products')
	}

	// >> Remove usuários
	await Produtos.destroy({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir produtp')
		res.redirect('products')
		throw err
	})

	req.flash('success_msg', 'Produto excluído com sucesso')
	res.redirect('/admin/products')
})

routes.post('/update', [
	body('id').isInt().withMessage('Id inválido').bail().custom(validators.findUser),
	body('email').optional({ checkFalsy: true }).isEmail().withMessage('E-mail inválido').bail().custom(validators.findEmail),
	body('password').optional({ checkFalsy: true }).custom(validators.comparePasswords)
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
			req.flash('data', req.body)
		})
		return res.redirect(`update/${req.body.id}`)
	}

	// Procura o usuário
	const user = await Usuarios.findOne({ where: { id: req.body.id } }).catch(err => {
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
], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		errors.errors.forEach(err => {
			req.flash('error_msg', err.msg)
		})
		return res.redirect('users')
	}

	// Remove usuários
	await Usuarios.destroy({ where: { id: req.body.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir usuário')
		res.redirect('users')
		throw err
	})

	req.flash('success_msg', 'Usuário excluído com sucesso')
	res.redirect('users')
})

module.exports = routes