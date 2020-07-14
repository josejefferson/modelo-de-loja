const Product = require('../models/Product')
const { Op } = require('sequelize')

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
	},

	rndString: function () {
		const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		let string = '';
		for (let i = 0; i < 64; i++) {
			string += chars[Math.floor(Math.random() * chars.length)];
		}
		return string;
	}
}