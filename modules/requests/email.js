const ejs = require('ejs')
const dayjs = require('dayjs')
const { random } = require('@modules/helpers')
const transporter = require('@modules/emails')
const logger = require('@modules/logger')
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

async function sendEmail(purpose, req, res, next) {
	// Cancelar se as credenciais não foram informadas
	if (!process.env['EMAIL'] || !process.env['CLIENT_ID'] || !process.env['CLIENT_SECRET'] || !process.env['REFRESH_TOKEN']) return
	const transport = await transporter

	const requests = req.data.requests || [req.data.request]
	for (const request of requests) {
		request.populate(['productId', 'clientId']).then(async (request) => {
			if (!request.clientId.email || !request.clientId.emailConfirmed || !request.clientId.sendEmails) return
			const html = await ejs.renderFile('./views/others/email-request.ejs', { request, purpose, dayjs })
			const mailOptions = {
				from: {
					name: 'Modelo de Loja',
					address: process.env['GMAIL_EMAIL']
				},
				to: request.clientId.email,
				subject: SUBJECTS[purpose] + ` [${random.string(6, random.NUM)}]`,
				html: html
			}

			transport.sendMail(mailOptions, (error, info) => {
				if (error) logger('Nodemailer').error('Erro ao enviar e-mail! ' + error.message)
			})
		})
	}
}