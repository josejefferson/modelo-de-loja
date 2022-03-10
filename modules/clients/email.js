const ejs = require('ejs')
const { random } = require('@modules/helpers')
const transporter = require('@modules/emails')
const logger = require('@modules/logger')
module.exports = actions = {}

actions.sendConfirmation = async (client) => {
	// Cancelar se as credenciais não foram informadas
	if (!process.env['EMAIL'] || !process.env['CLIENT_ID'] || !process.env['CLIENT_SECRET'] || !process.env['REFRESH_TOKEN']) return
	const transport = await transporter

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

	transport.sendMail(mailOptions, (error, info) => {
		if (error) logger('Nodemailer').error('Erro ao enviar e-mail! ' + error.message)
	})
}