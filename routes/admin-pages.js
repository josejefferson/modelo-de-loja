const express = require('express')
const routes = express.Router()
const User = require('../models/User')
const Product = require('../models/Product')
const { param, validationResult } = require('express-validator')
const check = require('../helpers/checks')
const validate = check.validate

const products = require('./admin-products')
const requests = require('./admin-requests')
routes.use('/products', products)
routes.use('/requests', requests)

routes.get('/', (req, res) => {
	res.render('pages/admin/admin', {
		_page: 'admin',
		_title: 'Página inicial'
	})
})

routes.get('/users', async (req, res) => {
	const users = await User.findAll({ attributes: { exclude: ['password'] } }).catch(err => {
		req.flash('error_msg', 'Falha ao carregar lista de usuários')
		res.redirect('/admin')
	})

	res.render('pages/admin/users', {
		_page: 'users',
		_title: 'Lista de usuários',
		users
	})
})

routes.get('/signup', (req, res) => {
	res.render('pages/admin/signup', {
		_page: 'signup',
		_title: 'Registrar'
	})
})

routes.get('/update/:id', [
	param('id').isInt().withMessage('ID inválido')
], validate('users'), async (req, res) => {

	const user = await User.findOne({ where: { id: req.params.id } }).catch(err => {
		req.flash('error_msg', 'Ocorreu um erro interno')
		res.redirect('users')
		throw err
	})

	if (user) {
		res.render('pages/admin/update', {
			_page: 'update',
			_title: `Atualizar ${user.name}`,
			user
		})
	} else {
		req.flash('error_msg', 'O usuário não foi encontrado')
		res.redirect('users')
	}
})

module.exports = routes