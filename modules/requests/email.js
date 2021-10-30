const ejs = require('ejs')
const transporter = require('../emails')
const moment = require('moment')
const logger = require('../logger')
module.exports = actions = {}

actions.buy = (req, res, next) => {
	const requests = req.data.requests

	for (const request of requests) {
		request.populate(['productId', 'clientId']).then(async (request) => {
			if (!request.clientId.email) return
			const html = await ejs.renderFile('./views/others/email-request.ejs', { request, purpose: 'pending', moment })
			const mailOptions = {
				from: {
					name: 'Modelo de Loja',
					address: process.env['GMAIL_EMAIL']
				},
				to: request.clientId.email,
				subject: 'Compra efetuada com sucesso - Modelo de Loja',
				text: '',
				html: html
			}
			
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					logger('E-mail').error(error)
				} else {
					logger('E-mail').info(info)
				}
			})
		})
	}
}