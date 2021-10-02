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

function render(page, title, _next = false, folder = 'pages') {
	return (req, res, next) => {
		req.data = req.data || {}
		res.render(folder + '/' + page, {
			url: req.originalUrl,
			fullURL: req.protocol + '://' + req.get('host') + req.originalUrl,
			_page: page,
			_title: title,
			query: req.query,
			...req.data
		}, (err, html) => {
			if (err) {
				err.ejs = true
				next(err)
			}
			else {
				res.send(html)
				if (_next) next()
			}
		})
	}
}

function renderMsg(title, message) {
	return (req, res, next) => {
		res.render('others/objNotFound', {
			url: req.originalUrl,
			fullURL: req.protocol + '://' + req.get('host') + req.originalUrl,
			_page: 'others/objNotFound',
			_title: title,
			title,
			message
		})
	}
}

module.exports = { getCart, render, renderMsg }