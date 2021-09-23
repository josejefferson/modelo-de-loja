const Product = require('mongoose').model('Products')

function get(productIDs, onlyWithStock = false) {
	const products = productIDs.map((id) => {
		return Product.findOne({
			_id: id,
			...(onlyWithStock && { stock: { $ne: 0 } })
		}).catch(_ => {})
	})
	return Promise.all(products)
}

module.exports = {
	actions: {
		get
	}
}