const Product = require('../models/Product')
const Client = require('../models/Client')
const User = require('../models/User')
const Request = require('../models/Request')
const helpers = require('../helpers/helpers')
const moment = require('moment')

module.exports = {
	cart: (req, res, next) => {
		req.data = req.data || {}
		req.data.cart = (req.cookies.cart && req.cookies.cart.split(',')) || []
		return next()
	},
	cartProds: async (req, res, next) => {
		req.data = req.data || {}
		const { cart, products } = await helpers.getCart(req.data.cart)
		res.cookie('cart', cart.join(','), { maxAge: 315360000000 })
		req.data.cart = cart.join(',')
		req.data.products = products
		return next()
	},
	products: async (req, res, next) => {
		req.data = req.data || {}
		req.data.products = await Product.find()
		req.data.products.reverse().sort((a, b) => {
			if (b.stock === 0) return -1
			return 0
		})
		return next()
	},
	product: async (req, res, next) => {
		req.data = req.data || {}
		req.data.product = await Product.findOne({ _id: req.params.id })
		return next()
	},
	users: async (req, res, next) => {
		req.data = req.data || {}
		const userIds = (req.cookies.userIds && (req.cookies.userIds.split(',') || [])) || []
		req.data.users = await Client.find({ clientId: userIds })
		return next()
	},
	user: async (req, res, next) => {
		req.data = req.data || {}
		req.data.user = await Client.findOne({ clientId: req.params.id })
		return next()
	},
	admins: async (req, res, next) => {
		req.data = req.data || {}
		req.data.admins = await User.find().select('-password') // catch
		return next()
	},
	admin: async (req, res, next) => {
		req.data = req.data || {}
		req.data.admin = await User.findOne({ _id: req.params.id })
		return next()
	},
	requests: async (req, res, next) => {
		req.data = req.data || {}
		req.data.requests = await Request.find({
			$or: [
				{ pending: true },
				{ $and: [{ pending: false }, { confirmed: true }, { done: false }] }
			],
		}).populate('productId').populate('clientId')
		return next()
	},
	moment: (req, res, next) => {
		req.data = req.data || {}
		req.data.moment = moment
		return next()
	}
}