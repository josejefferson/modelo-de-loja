const Client = require('mongoose').model('Clients')
module.exports = db = {}

db.get = (req, res, next) => {
	return Client.findById(req.params.id).then((client) => {
		if (!client) return res.status(400).render('others/error', {
			_title: 'Este cliente não existe',
			message: 'Talvez o link esteja incorreto ou o cliente foi excluído'
		})
		req.data.user = client
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar o cliente',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.getBody = (req, res, next) => {
	return Client.findById(req.body.user).then((client) => {
		if (!client) return res.status(400).render('others/error', {
			_title: 'Este cliente não existe',
			message: 'Talvez o link esteja incorreto ou o cliente foi excluído'
		})
		req.data.clientUser = client
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar o cliente',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.getMine = (req, res, next) => {
	return Client.find({ _id: req.data.userIDs }).then((clients) => {
		req.data.users = clients || []
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar clientes',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.getAll = (req, res, next) => {
	return Client.find().then((clients) => {
		req.data.users = clients || []
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar clientes',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.add = (req, res, next) => {
	return Client.create({
		name: req.body.name,
		address: req.body.address,
		phone: req.body.phone,
		whatsapp: req.body.whatsapp,
		email: req.body.email
	}).then((client) => { // colocar o (client) nos outros
		req.data.userIDs.push(client._id)
		res.cookie('userIds', req.data.userIDs.join(','), { maxAge: 315360000000 })
		req.flash('successMsg', `Cliente "${req.body.name}" adicionado com sucesso`)
		return res.redirect(req.query.r || '/clients')
	}).catch((err) => {
		// validar administrador já existente
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao criar cliente')
		req.flash('userData', req.body)
		res.redirect(req.query.r || '/clients/add')
	})
}

db.edit = (req, res, next) => {
	return Client.findById(req.params.id).then((client) => {
		client.name = req.body.name
		client.address = req.body.address
		client.phone = req.body.phone
		client.whatsapp = req.body.whatsapp
		client.email = req.body.email
		return client.save()
	}).then(() => {
		req.flash('successMsg', `Cliente "${req.body.name}" editado com sucesso`)
		res.redirect(req.query.r || '/clients')
	}).catch((err) => {
		req.flash('errorMsg', err.message || 'Ocorreu um erro desconhecido ao editar cliente') // não colocar esses err.message
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/clients/edit/${req.params.id}`)
	})
}

db.remove = (req, res, next) => {
	return Client.removeMany({ _id: req.params.id }).then(() => { // tentar organizar removeMany findById
		req.flash('successMsg', 'Cliente excluído com sucesso')
		res.redirect(req.query.r || '/clients')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir cliente')
		res.redirect(req.query.r || '/clients')
	})
}