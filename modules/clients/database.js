const Client = require('mongoose').model('Clients')
const { random } = require('@helpers/helpers')
const email = require('./email')
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
	const clients = req.data.userIDs.map((id) => {
		return Client.findById(id).catch(() => null)
	})
	return Promise.all(clients).then((clients) => {
		clients = clients.filter(p => p != null)
		req.data.users = clients || []
		next()
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao carregar clientes',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.getMineToBuy = (req, res, next) => {
	const clients = req.data.userIDs.map((id) => {
		return Client.findById(id).catch(() => null)
	})
	return Promise.all(clients).then((clients) => {
		clients = clients.filter(p => p != null)
		if (clients.length === 0) {
			req.flash('warningMsg', 'Cadastre seus dados antes de comprar')
			return res.redirect('/clients/add?r=' + encodeURIComponent(req.originalUrl))
		}
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
		email: req.body.email,
		sendEmails: !!req.body.sendEmails,
		emailVerificationToken: random.string(36, random.HEX)
	}).then((client) => {
		if (client.email) {
			req.flash('infoMsg', 'Um link de confirmação será enviado para o seu e-mail')
			email.sendConfirmation(client)
		}
		req.data.userIDs.push(client._id)
		res.cookie('userIds', req.data.userIDs.join(','), { maxAge: 315360000000 })
		req.flash('successMsg', `Cliente "${req.body.name}" adicionado com sucesso`)
		return res.redirect(req.query.r || '/clients')
	}).catch((err) => {
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
		client.sendEmails = !!req.body.sendEmails
		if (client.isModified('email')) {
			client.emailConfirmed = false
			client.emailVerificationToken = random.string(36, random.HEX)
			if (req.body.email !== '') {
				req.flash('infoMsg', 'Um link de confirmação será enviado para o seu e-mail')
				email.sendConfirmation(client)
			}
		}
		return client.save()
	}).then((client) => {
		req.flash('successMsg', `Cliente "${req.body.name}" editado com sucesso`)
		res.redirect(req.query.r || '/clients')
	}).catch((err) => {
		req.flash('errorMsg', err.message || 'Ocorreu um erro desconhecido ao editar cliente') // não colocar esses err.message
		req.flash('userData', req.body)
		res.redirect(err.redirect || `/clients/edit/${req.params.id}`)
	})
}

db.remove = (req, res, next) => {
	return Client.findByIdAndDelete(req.params.id).then((client) => { // tentar organizar removeMany findById
		req.flash('successMsg', `Cliente "${client.name}" excluído com sucesso`)
		res.redirect(req.query.r || '/clients/all')
	}).catch((err) => {
		req.flash('errorMsg', 'Ocorreu um erro desconhecido ao excluir cliente')
		res.redirect(req.query.r || '/clients/all')
	})
}

db.validateEmail = (req, res, next) => {
	return Client.findOne({ emailVerificationToken: req.params.token }).then((client) => {
		if (!client) return res.status(400).render('others/error', {
			_title: 'Link inválido',
			message: 'O link que você clicou pode ter expirado, já foi usado ou está incorreto'
		})
		client.emailConfirmed = true
		client.emailVerificationToken = null
		return client.save().then((client) => {
			req.flash('successMsg', 'E-mail confirmado com sucesso!')
			res.redirect(req.query.r || '/')
		})
	}).catch((err) => {
		res.status(500).render('others/error', {
			_title: 'Ocorreu um erro ao confirmar e-mail',
			message: 'Tente novamente recarregando a página'
		})
	})
}

db.unsubscribeEmail = (req, res, next) => {
	return Client.findById(req.params.id).then((client) => {
		if (!client) return res.status(400).render('others/error', {
			_title: 'Este cliente não existe',
			message: 'Talvez o link esteja incorreto ou o cliente foi excluído'
		})
		client.sendEmails = false
		return client.save().then((client) => {
			req.flash('successMsg', 'Você não receberá mais e-mails do site')
			res.redirect(req.query.r || '/')
		})
	})
}

db.unconfirmEmail = (req, res, next) => {
	return Client.findById(req.params.id).then((client) => {
		if (!client) return res.status(400).render('others/error', {
			_title: 'Este cliente não existe',
			message: 'Talvez o link esteja incorreto ou o cliente foi excluído'
		})
		if (!client.emailConfirmed) {
			req.flash('infoMsg', 'Este e-mail ainda não foi confirmado')
			return res.redirect(req.query.r || '/')
		}
		client.emailConfirmed = false
		client.emailVerificationToken = null
		return client.save().then((client) => {
			req.flash('successMsg', 'Seu e-mail não está mais confirmado')
			res.redirect(req.query.r || '/')
		})
	})
}

db.resendEmail = (req, res, next) => {
	return Client.findById(req.params.id).then((client) => {
		if (!client) return res.status(400).render('others/error', {
			_title: 'Este cliente não existe',
			message: 'Talvez o link esteja incorreto ou o cliente foi excluído'
		})
		if (!client.email) {
			req.flash('errorMsg', 'Este cliente não possui e-mail')
			return res.redirect(req.query.r || '/clients')
		}
		if (client.emailConfirmed) {
			req.flash('warningMsg', 'Este e-mail já foi confirmado')
			return res.redirect(req.query.r || '/clients')
		}
		client.emailConfirmed = false
		client.emailVerificationToken = random.string(36, random.HEX)
		return client.save().then((client) => {
			email.sendConfirmation(client)
			req.flash('infoMsg', 'Um novo link de confirmação será enviado para o seu e-mail')
			res.redirect(req.query.r || '/clients')
		})
	})
}