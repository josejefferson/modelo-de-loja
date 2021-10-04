const Product = require('mongoose').model('Products')
module.exports = db = {}

db.get = (req, res, next) => {
	const products = req.data.cartIDs.map((id) => {
		return Product.findById(id).catch(() => null)
	})
	return Promise.all(products).then((products) => {
		const invalidProducts = products.filter(p => p == null)
		const soldOutProducts = products.filter(p => p && p.stock == 0)
		if (invalidProducts.length > 0) {
			req.flash('warningMsg', `${invalidProducts.length} produtos foram ignorados, pois foram excluídos`)
		}
		if (soldOutProducts.length > 0) {
			req.flash('warningMsg', `${soldOutProducts.length} produtos foram ignorados, pois estão esgotados${soldOutProducts.map(p => '\n* ' + p.name)}`)
		}

		products = products.filter(p => p != null && p.stock != 0)
		req.data.products = products
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar carrinho',
			message: 'Tente novamente recarregando a página'
		})
	})
}