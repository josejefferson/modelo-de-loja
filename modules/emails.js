const nodemailer = require('nodemailer')
const logger = require('@modules/logger')('Nodemailer')

const missingCred = !process.env['GMAIL_EMAIL'] || !process.env['GMAIL_PASSWORD']

if (missingCred) {
	logger.warn('Credenciais de e-mail não informadas! O serviço foi desativado')
}

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	auth: {
		user: process.env['GMAIL_EMAIL'],
		pass: process.env['GMAIL_PASSWORD']
	}
})

if (!missingCred) transporter.verify().then(() => {
	logger.succ('E-mail testado com sucesso')
}).catch((err) => {
	logger.error('Erro ao testar e-mail! ' + err.message)
})

module.exports = transporter