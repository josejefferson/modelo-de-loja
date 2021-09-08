const Product = require('./model')
const Request = require('../requests/model')

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
function edit({ id, newName, newDescription, newPrice, newOldPrice, newBadge, newImage, newMedia, newStock, newHidden } = {}) {
	return Product.findOne({ _id: id }).then(product => {
		if (newName) product.name = newName
		if (newDescription) product.description = (newDescription === '' ? '' : newDescription)
		if (newPrice) product.price = newPrice
		if (newOldPrice) product.oldprice = (newOldPrice === '' ? '' : newOldPrice)
		if (newBadge) product.badge = (newBadge === '' ? '' : newBadge)
		if (newImage) product.image = (newImage == '' ? '' : newImage)
		if (newMedia) product.media = newMedia
		if (newStock) product.stock = newStock
		product.hidden = newHidden ? true : false

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