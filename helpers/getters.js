const Product = require('../models/Product')
const Client = require('../models/Client')
const User = require('../models/User')
const Request = require('../models/Request')
const Image = require('../models/Image')
const helpers = require('../helpers/helpers')
const moment = require('moment')

module.exports = {
	cart: (req, res, next) => {
		req.data.cart = (req.cookies.cart && req.cookies.cart.split(',')) || []
		return next()
	},
	cartProds: async (req, res, next) => {
		const { cart, products } = await helpers.getCart(req.data.cart)
		res.cookie('cart', cart.join(','), { maxAge: 315360000000 })
		req.data.cart = cart.join(',')
		req.data.products = products
		return next()
	},
	allProducts: async (req, res, next) => {
		req.data.products = await Product.find().catch(error(req, res))
		req.data.products.reverse().sort((a, b) => {
			if (b.stock === 0) return -1
			return 0
		})
		return next()
	},
	products: async (req, res, next) => {
		req.data.products = await Product.find({ hidden: { $ne: true } }).catch(error(req, res))
		req.data.products.reverse().sort((a, b) => {
			if (b.stock === 0) return -1
			return 0
		})
		return next()
	},
	product: async (req, res, next) => {
		req.data.product = await Product.findOne({ _id: req.params.id }).catch(error(req, res))
		return next()
	},
	users: async (req, res, next) => {
		const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
		req.data.users = await Client.find({ _id: userIds }).catch(error(req, res))
		//todo: redirecionar caso não haja usuários na hora de comprar
		return next()
	},
	user: async (req, res, next) => {
		req.data.user = await Client.findOne({ _id: req.params.id }).catch(error(req, res))
		return next()
	},
	admins: async (req, res, next) => {
		req.data.admins = await User.find().select('-password').catch(error(req, res))
		return next()
	},
	admin: async (req, res, next) => {
		req.data.admin = await User.findOne({ _id: req.params.id }).catch(error(req, res))
		return next()
	},
	requests: async (req, res, next) => {
		req.data.requests = await Request.find()
			.populate('productId', 'name price image').populate('clientId') //catch
		return next()
	},
	image: async (req, res, next) => {
		req.data.image = await Image.findOne({ _id: req.params.id }).catch(error(req, res))
		return next()
	},
	images: async (req, res, next) => {
		req.data.images = await Image.find().select('-data').catch(error(req, res))
		return next()
	},
	moment: (req, res, next) => {
		req.data.moment = moment
		return next()
	},
	myRequests: async (req, res, next) => {
		req.data.myRequests = {}
		const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
		for (id of userIds)
			req.data.myRequests[id] = (await Request.find({ clientId: id })
				.populate('productId', 'name price image').populate('clientId').catch(error(req, res))).reverse()
		return next()
	}
}

function error(req, res) {
	return () => {
		req.flash('error_msg', 'Ocorreu um erro')
		res.redirect('.')
	}
}