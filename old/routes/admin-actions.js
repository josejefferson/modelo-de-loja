const express = require('express')
const routes = express.Router()
const User = require('../models/User')
const { body } = require('express-validator')
const validators = require('../helpers/validators')
const bcrypt = require('bcryptjs')
const check = require('../helpers/middlewares')
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
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao criar usuário')
		req.flash('data', req.body)
		res.redirect('signup')
		throw err
	})

	req.flash('successMsg', `Usuário ${req.body.name} criado com sucesso`)
	if (req.authUser && req.authUser.admin) return res.redirect('users')
	return res.redirect('/')
})

routes.post('/update', [
	body('id').notEmpty().withMessage('Id inválido').bail().custom(validators.findUser),
	body('email').optional({ checkFalsy: true }).isEmail().withMessage('E-mail inválido').bail().custom(validators.findEmail),
	body('password').optional({ checkFalsy: true }).custom(validators.comparePasswords)
], async (req, res) => {

	if (!check.isValid(req, res)) return res.redirect(`update/${req.body.id}`)

	// Procura o usuário
	const user = await User.findOne({ _id: req.body.id }).catch(err => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao procurar usuário')
		req.flash('data', req.body)
		res.redirect(`update/${req.body.id}`)
		throw err
	})

	if (user) {
		// Atualiza dados do usuário
		if (req.body.name) user.name = req.body.name
		if (req.body.email) user.email = req.body.email
		if (req.body.password) user.password = bcrypt.hashSync(req.body.password, 10)

		await user.save().catch(err => {
			req.flash('errorMsg', 'Ocorreu um erro desconhecido ao editar usuário')
			req.flash('data', req.body)
			res.redirect(`update/${req.body.id}`)
			throw err
		})
	} else {
		// Caso o usuário não exista
		req.flash('errorMsg', 'O usuário não foi encontrado')
		res.redirect('users')
		throw 'Usuário não encontrado'
	}

	req.flash('successMsg', 'Editado com sucesso')
	res.redirect('users')
})

routes.post('/remove', [
	body('id').notEmpty().withMessage('Id inválido').bail().custom(validators.findUser)
], validate('users'), async (req, res) => {

	// Remove usuários
	await User.deleteMany({ _id: req.body.id }).catch(err => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir usuário')
		res.redirect('users')
		throw err
	})

	req.flash('successMsg', 'Usuário excluído com sucesso')
	res.redirect('users')
})

module.exports = routes