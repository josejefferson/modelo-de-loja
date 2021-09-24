const express = require('express')
const routes = express.Router()
const User = require('../models/User')
const { param } = require('express-validator')
const check = require('../helpers/middlewares')
const validate = check.validate

const products = require('./admin-products')
const requests = require('./admin-requests')
routes.use('/products', products)
routes.use('/requests', requests)

routes.get('/', (req, res) => {
	res.redirect('/')
})

routes.get('/users', async (req, res) => {
	const users = await User.find().select('-password').catch(err => {
		req.flash('errorMsg', 'Falha ao carregar lista de usuários')
		res.redirect('/')
	})

	res.render('pages/admin/users', {
		_page: 'admins',
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
	param('id').notEmpty().withMessage('ID inválido')
], validate('users'), async (req, res) => {

	const user = await User.findOne({ _id: req.params.id }).catch(err => {
		req.flash('errorMsg', 'Ocorreu um erro interno')
		res.redirect('users')
		throw err
	})

	if (user) {
		res.render('pages/admin/signup', {
			_page: 'update',
			_title: `Atualizar ${user.name}`,
			user
		})
	} else {
		req.flash('errorMsg', 'O usuário não foi encontrado')
		res.redirect('users')
	}
})

module.exports = routes