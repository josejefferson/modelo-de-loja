const ejs = require('ejs')
const transporter = require('../emails')
const moment = require('moment')
const logger = require('../logger')
module.exports = actions = {}

const SUBJECTS = {
	pending: 'Compra efetuada com sucesso',
	confirmed: 'Pedido confirmado',
	rejected: 'Pedido rejeitado',
	canceled: 'Pedido cancelado',
	closed: 'Pedido concluído!',
	feedback: 'Aviso adicionado no pedido!'
}

actions.buy = (req, res, next) => {
	sendEmail('pending', req, res, next)
}

actions.confirm = (req, res, next) => {
	let purpose = ''
	switch (req.body.confirm) {
		case 'confirm': purpose = 'confirmed'; break
		case 'reject': purpose = 'rejected'; break
		case 'done': purpose = 'closed'; break
		case 'feedback': purpose = 'feedback'; break
	}
	sendEmail(purpose, req, res, next)
}

actions.cancel = (req, res, next) => {
	sendEmail('canceled', req, res, next)
}

function sendEmail(purpose, req, res, next) {
	const requests = req.data.requests || [req.data.request]
	for (const request of requests) {
		request.populate(['productId', 'clientId']).then(async (request) => {
			if (!request.clientId.email) return
			const html = await ejs.renderFile('./views/others/email-request.ejs', { request, purpose, moment })
			const mailOptions = {
				from: {
					name: 'Modelo de Loja',
					address: process.env['GMAIL_EMAIL']
				},
				to: request.clientId.email,
				subject: SUBJECTS[purpose],
				html: html
			}

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) logger('E-mail').error(error)
				else logger('E-mail').info(info)
			})
		})
	}
}