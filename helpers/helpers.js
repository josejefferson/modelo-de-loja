const Product = require('../models/Product')

async function getCart(cart, rmSoldOut = false) {
	cart = [...new Set(cart)]
	const products = []
	for (item of cart) {
		const product = await Product.findOne({
			_id: item,
			...(rmSoldOut && { stock: { $ne: 0 } })
		})
		if (product) products.push(product)
		else cart.splice(cart.indexOf(item), 1)
	}
	return { cart, products }
}

function rndString() {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let string = ''
	for (let i = 0; i < 64; i++) {
		string += chars[Math.floor(Math.random() * chars.length)]
	}
	return string
}

function render(page, title) {
	return (req, res, next) => {
		req.data = req.data || {}
		res.render('pages/' + page, {
			url: req.url,
			_page: page,
			_title: title,
			query: req.query,
			...req.data
		})
		return next()
	}
}

module.exports = { getCart, rndString, render }