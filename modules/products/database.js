const Product = require('mongoose').model('Products')
const Request = require('mongoose').model('Requests')
module.exports = db = {}

// Busca um produto
db.get = (req, res, next) => {
	return Product.findById(req.params.id).select('+ratings').then((product) => {
		if (!product) return res.status(400).render('others/error', {
			_title: 'Este produto não existe',
			message: 'Talvez o link esteja incorreto ou o produto foi excluído'
		})
		product.ratings = product.ratings.filter(r => req.data.userIDs.includes(r.client.toString()))
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

db.rate = (req, res, next) => {
	Product.findById(req.params.id).select('+ratings').then((product) => {
		if (!product) return res.status(400).render('others/error', {
			_title: 'Este produto não existe',
			message: 'Talvez o link esteja incorreto ou o produto foi excluído'
		})
		
		Request.findOne({clientId: req.params.client, productId: product._id, status: 'confirmed', open: false}).then((request) => {
			if (!request) return res.status(400).render('others/error', {
				_title: 'Você não pode avaliar',
				message: 'Você não pode avaliar um produto que nunca comprou e recebeu'
			})			

			let rating = product.ratings.find(r => r.client == req.params.client)
			if (req.params.rating == '0') {
				if (rating) product.ratings.pull({ _id: rating._id })
			} else {
				if (rating) rating.rating = req.params.rating
				else rating = product.ratings.push({
					client: req.params.client,
					rating: req.params.rating
				})
			}

			product.rating = {
				1: product.ratings.filter(r => r.rating == 1).length,
				2: product.ratings.filter(r => r.rating == 2).length,
				3: product.ratings.filter(r => r.rating == 3).length,
				4: product.ratings.filter(r => r.rating == 4).length,
				5: product.ratings.filter(r => r.rating == 5).length,
				totalUsers: product.ratings.length,
				average: product.ratings.reduce((a, c) => a += c.rating, 0) / product.ratings.length
			}

			product.save().then(()=>res.send('Funcionou!'))
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
		product.hidden = !!req.body.hidden
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