const Product = require('mongoose').model('Products')
const Request = require('mongoose').model('Requests')

// Busca um produto
function get({ id } = {}) {
	return Product.findOne({ _id: id })
}

// Busca todos os produtos que não estão ocultos
function getAll() {
	return Product.find({ hidden: { $ne: true } })
}

// Adiciona um produto
function add({ name, description, price, oldprice, badge, image, media, stock, hidden } = {}) {
	return Product.create({
		name: name,
		description: description,
		price: price,
		oldprice: oldprice,
		badge: badge,
		image: image,
		media: media || [],
		stock: stock,
		hidden: hidden ? true : false
	})
}

// Edita um produto
function edit({ id, name, description, price, oldprice, badge, image, media, stock, hidden } = {}) {
	return Product.findOne({ _id: id }).then((product) => {
		if (name) product.name = name
		if (description) product.description = (description === '' ? '' : description)
		if (price) product.price = price
		if (oldprice) product.oldprice = (oldprice === '' ? '' : oldprice)
		if (badge) product.badge = (badge === '' ? '' : badge)
		if (image) product.image = (image == '' ? '' : image)
		if (media) product.media = media
		if (stock) product.stock = stock
		product.hidden = hidden ? true : false

		return product.save()
	})
}

// Remove um produto
function remove({ id } = {}) {
	return Request.deleteMany({ productId: id }).then(() => {
		return Product.deleteMany({ _id: id })
	})
}

module.exports = {
	get,
	getAll,
	add,
	edit,
	remove
}