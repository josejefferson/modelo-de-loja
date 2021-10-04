const Request = require('mongoose').model('Requests')
module.exports = db = {}

db.get = (req, res, next) => {
	Request.findById(req.params.id).populate('productId', 'name price image').populate('clientId').then((request) => {
		if (!request) return res.status(400).render('others/error', {
			_title: 'Este pedido não existe',
			message: 'Talvez o link esteja incorreto ou o pedido foi excluído'
		})
		req.data.request = request
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar o pedido',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.getAll = (req, res, next) => {
	Request.find().populate('productId', 'name price image').populate('clientId').then((requests) => {
		req.data.requests = requests || []
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar pedidos',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.getAllFromClient = ({ clientID } = {}) => {
	return Request.find({ clientId: clientID }).populate('productId', 'name price image').populate('clientId')
}

db.add = ({ clientID, productID, quantity, other } = {}) => {
	return Request.create({
		clientId: clientID,
		productId: productID,
		quantity: quantity,
		other: other
	}).then((request) => {
		return request
			.populate('productId', 'name price image')
		//.populate('clientId')
	})
	// verificar se o populate funciona assim
}

db.remove = ({ id } = {}) => {
	return Request.deleteMany({ _id: id })
}