const Product = require('../models/Product')
const Client = require('../models/Client')
const User = require('../models/User')
const Request = require('../models/Request')
const Image = require('../models/Image')
const helpers = require('../helpers/helpers')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

module.exports = io => ({
	cancelReq: async (req, res, next) => {
		const request = await Request.findOne({ _id: req.params.id })
		if (req.body.clientId != request.clientId || request.status !== 'pending') return res.sendStatus(400)
		await Request.deleteMany({ _id: req.params.id })
		res.json({ success: true })
	},
	json: (req, res, next) => { res.json(req.data) },
	upload: multer({ dest: './' }).single('files'),
	uploadImg: async (req, res, next) => {
		let valid = true
		if (!req.file) return res.json({ success: false, err: 'Nenhum arquivo enviado' })
		const filePath = path.join(__dirname, '..', req.file.filename)

		if (!['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
			.includes(req.file.mimetype) || req.file.size > 5242880) {
			valid = false
			res.json({ invalid: true })
		}

		if (valid) await Image.create({
			data: fs.readFileSync(filePath),
			contentType: req.file.mimetype
		}).then(() => res.json({ success: true }))
			.catch(() => res.json({ success: false }))

		fs.unlink(filePath, () => { })
	},
	showImage: async (req, res, next) => {
		const r = await Image.findById(req.params.id).catch(err => {
			return false
		})
		if (!r) return res.sendStatus(404)
		res.contentType(r.contentType)
		res.send(r.data)
	},
	removeImage: async (req, res, next) => {
		await Image.deleteMany({ _id: req.params.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir imagem')
			res.redirect(req.query.r || '/images')
			throw err
		})

		req.flash('success_msg', 'Imagem excluída com sucesso')
		res.redirect(req.query.r || '/images')
	},
	buy: async (req, res, next) => {
		const client = await Client.findOne({ _id: req.body.user })
		if (!client) {
			console.log(req.body.user, client)
			Client.find().then(console.log)
			// TODO:
		}
		await Request.create({
			clientId: client._id,
			productId: req.params.id,
			quantity: req.body.quantity,
			other: req.body.other
		})

		req.flash('success_msg', 'Compra efetuada com sucesso!')
		res.redirect(req.query.r || '/history')
	},
	cart: async (req, res, next) => {
		const products = req.body.products.split(',')
		const { cart } = await helpers.getCartItems(products, true)

		for (item of cart) {
			const client = await Client.findOne({ _id: req.body.clientId })
			await Request.create({
				clientId: client.id,
				productId: item,
				quantity: 1
			})
		}

		req.flash('success_msg', 'Compras efetuadas com sucesso')
		res.redirect(req.query.r || '/')
		// >> limpar carrinho
	},
	addUser: async (req, res, next) => {
		const { _id: clientId } = await Client.create({
			name: req.body.name,
			address: req.body.address,
			phone: req.body.phone,
			whatsapp: req.body.whatsapp,
			email: req.body.email
		})

		const userIds = req.cookies.userIds?.split(',') || []
		userIds.push(clientId)
		res.cookie('userIds', userIds.join(','), { maxAge: 315360000000 })

		req.flash('success_msg', `Usuário "${req.body.name}" criado`)
		res.redirect(req.query.r || '/users')
	},
	editUser: async (req, res, next) => {
		// TODO: usuario não existe
		const client = await Client.findOne({ _id: req.params.id })
		if (req.body.name) client.name = req.body.name
		if (req.body.address) client.address = req.body.address
		if (req.body.phone) client.phone = req.body.phone
		if (req.body.whatsapp) client.whatsapp = req.body.whatsapp
		if (req.body.email) client.email = req.body.email
		await client.save()

		req.flash('success_msg', `Usuário "${client.name}" editado com sucesso`)
		res.redirect(req.query.r || '/users')
	},
	login: async (req, res, next) => {
		passport.authenticate('local', function (err, user, info) {
			if (err || !user) {
				req.flash('error_msg', err ? 'Ocorreu um erro desconhecido' : info.message)
				req.flash('userData', req.body)
				return res.redirect(req.query.r || '/login')
			}
			req.logIn(user, err => {
				if (err) {
					req.flash('error_msg', 'Ocorreu um erro desconhecido')
					req.flash('userData', req.body)
					return res.redirect(req.query.r || '/login')
				}

				req.flash('success_msg', 'Logado com sucesso!')
				return res.redirect(req.query.r || '/requests')
			})
		})(req, res, next)
	},
	logout: async (req, res, next) => {
		req.logout()
		req.flash('success_msg', 'Deslogado com sucesso')
		res.redirect(req.query.r || '/login')
	},
	addAdmin: async (req, res, next) => {
		// Verificar se já não existe um admin com o mesmo email
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			admin: true
		}).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao criar administrador')
			req.flash('userData', req.body)
			res.redirect(req.query.r || '/admins/add')
			throw err
		})

		req.flash('success_msg', `Administrador "${req.body.name}" criado com sucesso`)
		return res.redirect(req.query.r || '/admins')
	},
	editAdmin: async (req, res, next) => {
		const user = await User.findOne({ _id: req.params.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar o administrador')
			req.flash('userData', req.body)
			res.redirect(`/admins/edit/${req.params.id}`)
			throw err
		})

		if (!user) {
			req.flash('error_msg', 'O administrador não foi encontrado')
			return res.redirect(req.query.r || '/admins')
		}

		if (req.body.name) user.name = req.body.name
		if (req.body.email) user.email = req.body.email
		if (req.body.password) user.password = bcrypt.hashSync(req.body.password, 10)

		await user.save().catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao editar administrador')
			req.flash('userData', req.body)
			res.redirect(`/admins/edit/${req.params.id}`)
			throw err
		})

		req.flash('success_msg', `Administrador "${user.name}" editado com sucesso`)
		res.redirect(req.query.r || '/admins')
	},
	removeAdmin: async (req, res, next) => {
		await User.deleteMany({ _id: req.params.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir administrador')
			res.redirect(req.query.r || '/admins')
			throw err
		})

		req.flash('success_msg', 'Administrador excluído com sucesso')
		res.redirect(req.query.r || '/admins')
	},
	addProduct: async (req, res, next) => {
		await Product.create({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			oldprice: req.body.oldprice,
			badge: req.body.badge,
			image: req.body.image,
			stock: req.body.stock,
			hidden: req.body.hidden ? true : false
		}).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao criar produto')
			req.flash('userData', req.body)
			res.redirect(req.query.r || '/products/add')
			throw err
		})

		req.flash('success_msg', `Produto "${req.body.name}" adicionado com sucesso`)
		return res.redirect(req.query.r || '/products')
	},
	editProduct: async (req, res, next) => {
		const product = await Product.findOne({ _id: req.params.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao procurar produto')
			req.flash('userData', req.body)
			res.redirect(`/products/edit/${req.params.id}`)
			throw err
		})

		if (!product) {
			req.flash('error_msg', 'O produto não foi encontrado')
			return res.redirect(req.query.r || '/products')
		}

		if (req.body.name) product.name = req.body.name
		if (req.body.description) product.description = (req.body.description === '' ? '' : req.body.description)
		if (req.body.price) product.price = req.body.price
		if (req.body.oldprice) product.oldprice = (req.body.oldprice === '' ? '' : req.body.oldprice)
		if (req.body.badge) product.badge = (req.body.badge === '' ? '' : req.body.badge)
		if (req.body.image) product.image = (req.body.image == '' ? '' : req.body.image)
		if (req.body.stock) product.stock = req.body.stock
		product.hidden = req.body.hidden ? true : false

		await product.save().catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao editar produto')
			req.flash('userData', req.body)
			res.redirect(`/products/edit/${req.params.id}`)
			throw err
		})

		req.flash('success_msg', `Produto "${product.name}" editado com sucesso`)
		res.redirect(req.query.r || '/products')
	},
	removeProduct: async (req, res, next) => {
		await Request.deleteMany({ productId: req.params.id })
		await Product.deleteMany({ _id: req.params.id }).catch(err => {
			req.flash('error_msg', 'Ocorreu um erro desconhecido ao excluir produto')
			res.redirect(req.query.r || '/products')
			throw err
		})

		req.flash('success_msg', 'Produto excluído com sucesso')
		res.redirect(req.query.r || '/products')
	},
	confirmRequest: async (req, res, next) => {
		// >> ao confirmar, diminuir do estoque
		const request = await Request.findOne({ _id: req.params.id })
		const product = await Product.findOne({ _id: request.productId })

		switch (req.body.confirm) {
			case 'confirm':
				request.status = 'confirmed'
				product.stock = product.stock > 0 ? product.stock - request.quantity : product.stock < 0 ? -1 : 0
				await product.save()
				break

			case 'reject':
				request.status = 'rejected'
				break

			case 'done':
				if (request.status === 'pending')
					request.status = 'confirmed'
				request.open = false
				break

			case 'feedback':
				request.feedback = req.body.feedback
				break

			case 'reset': // TODO: REMOVER NO FUTURO
				request.status = 'pending'
				request.open = true
				request.feedback = undefined
				break
		}
		await request.save()
		io.of('/history').to(request.clientId.toString()).emit('confirm', {
			clientId: request.clientId,
			requestId: request._id,
			action: req.body.confirm,
			...(req.body.feedback && { feedback: req.body.feedback })
		})

		res.json({ success: true })
	},
})