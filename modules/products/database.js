const mongoose = require('mongoose')

const Product = mongoose.model('Products', {
	name: { type: String, required: true },
	description: String,
	price: { type: Number, required: true },
	oldprice: { type: Number },
	badge: { type: String },
	rating: {
		_1: { type: Number, default: 0 },
		_2: { type: Number, default: 0 },
		_3: { type: Number, default: 0 },
		_4: { type: Number, default: 0 },
		_5: { type: Number, default: 0 }
	},
	image: String,
	media: [{
		type: { type: String, enum: ['image', 'yt-video'] },
		url: String
	}],
	stock: { type: Number, required: true },
	hidden: { type: Boolean, default: false }
})


const { Request } = require('../requests/database')

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
	Product,
	actions: {
		get,
		getAll,
		add,
		edit,
		remove
	}
}