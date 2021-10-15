const Product = require('mongoose').model('Products')
const Request = require('mongoose').model('Requests')
module.exports = db = {}

// Busca um produto
db.get = (req, res, next) => {
	return Product.findById(req.params.id).then((product) => {
		if (!product) return res.status(400).render('others/error', {
			_title: 'Este produto não existe',
			message: 'Talvez o link esteja incorreto ou o produto foi excluído'
		})
		req.data.product = product
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar o produto',
			message: 'Tente novamente recarregando a página'
		})
	})
}

// Busca todos os produtos que não estão ocultos
db.getAll = (req, res, next) => {
	return Product.find({ hidden: { $ne: true } }).then((products) => {
		req.data.products = products || []
		req.data.products.reverse().sort((a, b) => {
			return b.stock === 0 ? -1 : 0
		})
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar produtos',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.getALL = (req, res, next) => {
	return Product.find().then((products) => {
		req.data.products = products || []
		req.data.products.reverse().sort((a, b) => {
			return b.stock === 0 ? -1 : 0
		})
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar produtos',
			message: 'Tente novamente recarregando a página'
		})
	})
}

// Adiciona um produto
db.add = (req, res, next) => {
	return Product.create({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		oldprice: req.body.oldprice,
		badge: req.body.badge,
		image: req.body.image,
		media: req.body.media || [],
		stock: req.body.stock,
		hidden: req.body.hidden ? true : false
	}).then((product) => {
		req.flash('successMsg', `Produto "${product.name}" adicionado com sucesso`)
		return res.redirect(req.query.r || '/products')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao criar produto')
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/products/add')
	})
}

// Edita um produto
db.edit = (req, res, next) => {
	return Product.findById(req.params.id).then((product) => {
		product.name = req.body.name
		product.description = req.body.description
		product.price = req.body.price
		product.oldprice = req.body.oldprice
		product.badge = req.body.badge
		product.image = req.body.image
		product.media = req.body.media || []
		product.stock = req.body.stock
		product.hidden = req.body.hidden ? true : false
		return product.save()
	}).then((product) => {
		req.flash('successMsg', `Produto "${product.name}" editado com sucesso`)
		res.redirect(req.query.r || '/products')
	}).catch((err) => {
		req.flash('errorMsg', err.message || 'Ocorreu um erro desconhecido ao procurar produto')
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/products/edit/${req.params.id}`)
	})
}

// Remove um produto
db.remove = (req, res, next) => {
	return Request.deleteMany({ productId: req.params.id }).then(() => {
		return Product.findByIdAndDelete(req.params.id)
	}).then((product) => {
		req.flash('successMsg', `Produto "${product.name}" excluído com sucesso`)
		res.redirect(req.query.r || '/products')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir produto')
		res.redirect(req.query.r || '/products')
	})
}