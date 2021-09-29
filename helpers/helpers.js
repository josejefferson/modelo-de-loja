// const Product = require('mongoose').model('Products')

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

function render(page, title, _next = false) {
	return (req, res, next) => {
		req.data = req.data || {}
		res.render('pages/' + page, {
			url: req.originalUrl,
			fullURL: req.protocol + '://' + req.get('host') + req.originalUrl,
			_page: page,
			_title: title,
			query: req.query,
			...req.data
		})
		if (_next) next()
	}
}

module.exports = { getCart, render }