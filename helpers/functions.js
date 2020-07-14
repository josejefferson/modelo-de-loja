const Product = require('../models/Product')

module.exports = {
	getCartItems: async function (cart, removeSoldOut = false) {
		cart = [...new Set(cart)]
		let products = []
		for (item of cart) {
			const product = await Product.findOne({
				where: {
					id: item,
					...(removeSoldOut && 
							{ stock: { [Op.ne]: 0 } }
					)
				}
			})
			if (product) {
				products.push(JSON.parse(JSON.stringify(product)))
			} else {
				cart.splice(cart.indexOf(item), 1)
			}
		}
		return { cart, products }
	}
}