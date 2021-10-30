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

db.getMine = (req, res, next) => {
	req.data.myRequests = {}
	Promise.all(
		req.data.userIDs.map((userID) => {
			return Request.find({ clientId: userID })
				.populate('productId', 'name price image').populate('clientId').then((requests) => {
					requests.reverse()
					req.data.myRequests[userID] = requests
				}).catch((err) => {
					req.data.myRequests[userID] = []
				})
		})
	).then(() => next()).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar pedidos',
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

db.buy = async (req, res, next) => {
	const requests = req.body.products.map((product) => {
		return {
			clientId: req.data.clientUser._id,
			productId: product.id,
			quantity: product.quantity,
			other: req.body.other
		}
	})

	Request.create(requests).then((requests) => {
		return Promise.all(requests.map((request) => {
			return request.populate(['productId', 'clientId']).catch(() => null)
		}))
		// todo: verificar os requests que falharam
	}).then((requests) => {
		req.data.requests = requests
		const requestIDs = requests.map((request) => request._id).join(',')
		res.redirect(req.query.r || `/requests/my?requests=${requestIDs}`)
		next()
	})
}

db.cancel = (req, res, next) => {
	const request = req.data.request
	if (request.status !== 'pending') {
		res.status(400).json({ message: 'Você não pode cancelar, o pedido não está mais pendente' })
	} else {
		request.status = 'canceled'
		request.save().then((request) => {
			res.json({ success: true })
		}).catch((err) => {
			res.status(500).json(err)
		})
	}
	next()
}

db.confirm = (req, res, next) => {
	const request = req.data.request
	const product = req.data.request.productId

	switch (req.body.confirm) {
		case 'confirm':
			request.status = 'confirmed'
			product.stock = product.stock > 0 ? product.stock - request.quantity : product.stock < 0 ? -1 : 0
			product.save()
			break

		case 'reject':
			request.status = 'rejected'
			break

		case 'done':
			if (request.status === 'pending')
				request.status = 'confirmed'
			request.open = false
			break

		case 'feedback':
			request.feedback = req.body.feedback
			break

		case 'reset': // TODO: REMOVER NO FUTURO
			request.status = 'pending'
			request.open = true
			request.feedback = undefined
			break

		case 'delete':
			request.remove()
			break
	}

	request.save().then(() => {
		res.json({ success: true })
		next()
	}).catch((err) => {
		res.status(500).json({ success: false })
	})
}