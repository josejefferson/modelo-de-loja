const Product = require('../models/Product')
const Client = require('../models/Client')
const User = require('../models/User')
const Request = require('../models/Request')
const helpers = require('../helpers/helpers')
const functions = require('../helpers/helpers')
const passport = require('passport')
const bcrypt = require('bcryptjs')

module.exports = {
	buy: async (req, res, next) => { 
		const client = await Client.findOne({ clientId: req.body.clientId })
		await Request.create({
			clientId: client.id,
			productId: req.body.product,
			quantity: req.body.quantity,
			other: req.body.other
		})

		req.flash('success_msg', 'Compra efetuada com sucesso!')
		res.redirect('/')
	},
	cart: async (req, res, next) => { 
		const products = req.body.products.split(',')
		const { cart } = await functions.getCartItems(products, true)

		for (item of cart) {
			const client = await Client.findOne({ clientId: req.body.clientId })
			await Request.create({
				clientId: client.id,
				productId: item,
				quantity: 1
			})
		}

		req.flash('success_msg', 'Compras efetuadas com sucesso')
		res.redirect('/')
	// >> limpar carrinho
	},
	addUser: async (req, res, next) => { 
		const clientId = functions.rndString()
		await Client.create({
			clientId,
			name: req.body.name,
			address: req.body.address,
			phone: req.body.phone,
			email: req.body.email
		})

		if (!req.cookies.userIds) {
			res.cookie('userIds', clientId, { maxAge: 315360000000 })
		} else {
			let userIds = req.cookies.userIds.split(',')

			if (req.body.oldId) {
				userIds[userIds.indexOf(req.body.oldId)] = clientId
			} else {
				userIds.push(clientId)
			}

			userIds = userIds.join(',')
			res.cookie('userIds', userIds, { maxAge: 315360000000 })
		}

		res.redirect('/users')
	},
	editUser: async (req, res, next) => { 

	},
	login: async (req, res, next) => { 
		passport.authenticate('local', function (err, user, info) {

			if (err) {
				req.flash('error_msg', 'Ocorreu um erro desconhecido')
				req.flash('data', req.body)
				return res.redirect('/login')
			}
			if (!user) {
				req.flash('error_msg', info.message)
				req.flash('data', req.body)
				return res.redirect('/login')
			}
			req.logIn(user, function (err) {
				if (err) {
					req.flash('error_msg', 'Ocorreu um erro desconhecido')
					req.flash('data', req.body)
					return res.redirect('/login')
				}

				// Logado com sucesso
				req.flash('success_msg', 'Logado com sucesso!')
				return res.redirect('/')
			})
		})(req, res, next)
	},
	logout: async (req, res, next) => { 
		req.logout()
		req.flash('success_msg', 'Deslogado com sucesso')
		res.redirect('/login')
	},
	addAdmin: async (req, res, next) => { 
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
		if (req.user && req.user.admin) return res.redirect('/admins')
		return res.redirect('/')
	},
	editAdmin: async (req, res, next) => { 
		if (!check.isValid(req, res)) return res.redirect(`update/${req.body.id}`)

		// Procura o usuário
		const user = await User.findOne({ _id: req.body.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar usuário')
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
		res.redirect('/admins')
	},
	removeAdmin: async (req, res, next) => { 
		// Remove usuários
		await User.deleteMany({ _id: req.body.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir usuário')
			res.redirect('users')
			throw err
		})

		req.flash('success_msg', 'Usuário excluído com sucesso')
		res.redirect('/admins')
	},
	addProduct: async (req, res, next) => { 
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

		req.flash('success_msg', `Produto "${req.body.name}" adicionado com sucesso`)
		return res.redirect('/products')
	},
	editProduct: async (req, res, next) => { 
		const product = await Product.findOne({ _id: req.body.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar produto')
			req.flash('data', req.body)
			res.redirect(`/admin/products/edit/${req.body.id}`)
			throw err
		})

		if (product) {
			if (req.body.name) product.name = req.body.name
			if (req.body.description) product.description = (req.body.description === '' ? '' : (req.body.description))
			if (req.body.price) product.price = req.body.price
			if (req.body.image) product.image = (req.body.image == '' ? '' : (req.body.image))
			if (req.body.stock) product.stock = req.body.stock

			await product.save().catch(err => {
				req.flash('error_msg', 'Ocorreu um erro desconhecido ao editar produto')
				req.flash('data', req.body)
				res.redirect(`/admin/products/edit/${req.body.id}`)
				throw err
			})
		} else {
			req.flash('error_msg', 'O produto não foi encontrado')
			res.redirect('/products')
			throw 'Product não encontrado'
		}

		req.flash('success_msg', 'Editado com sucesso')
		res.redirect('/products')
	},
	removeProduct: async (req, res, next) => { 
		await Request.deleteMany({ productId: req.body.id })
		await Product.deleteMany({ _id: req.body.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir produto')
			res.redirect('/products')
			throw err
		})

		req.flash('success_msg', 'Product excluído com sucesso')
		res.redirect('/products')
	},
	confirmRequest: async (req, res, next) => { 
		// >> ao confirmar, diminuir do estoque
		const request = await Request.findOne({ _id: req.body.id }) // ** trocar find por findOne em algumas situações
		const product = await Product.findOne({ _id: request.productId })

		switch (req.body.confirm) {
			case 'confirm':
				request.pending = false
				request.confirmed = true
				product.stock = product.stock > 0 ? product.stock - request.quantity : product.stock < 0 ? -1 : 0
				await request.save()
				await product.save()
				break

			case 'reject':
				request.pending = false
				request.confirmed = false
				await request.save()
				break

			case 'done':

				request.pending = false
				request.confirmed = true
				request.done = true
				await request.save()
		}

		res.json({ success: true })
	},
}