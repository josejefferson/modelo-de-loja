const ejs = require('ejs')
const { random } = require('@helpers/helpers')
const transporter = require('@modules/emails')
const logger = require('@modules/logger')
module.exports = actions = {}

actions.sendConfirmation = async (client) => {
	// Cancelar se as credenciais não foram informadas
	if (!process.env['GMAIL_EMAIL'] || !process.env['GMAIL_PASSWORD']) return

	const html = await ejs.renderFile('./views/others/email-confirm.ejs', { client })
	const mailOptions = {
		from: {
			name: 'Modelo de Loja',
			address: process.env['GMAIL_EMAIL']
		},
		to: client.email,
		subject: `Confirme seu e-mail [${random.string(6, random.NUM)}]`,
		html: html
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) logger('Nodemailer').error('Erro ao enviar e-mail! ' + error.message)
	})
}