const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const logger = require('@modules/logger')('Nodemailer')

const missingCred =
	!process.env['EMAIL'] ||
	!process.env['CLIENT_ID'] ||
	!process.env['CLIENT_SECRET'] ||
	!process.env['REFRESH_TOKEN']

if (missingCred) {
	logger.warn('Credenciais de e-mail não informadas! O serviço foi desativado')
}

const transporter = new Promise(async (resolve, reject) => {
	const oauth2Client = new OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		'https://developers.google.com/oauthplayground'
	)

	oauth2Client.setCredentials({
		refresh_token: process.env.REFRESH_TOKEN
	})

	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) resolve()
			resolve(token)
		})
	})

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			accessToken,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN
		}
	})

	resolve(transporter)
})

if (!missingCred) transporter.then((transporter) => {
	return transporter.verify()
}).then(() => {
	logger.succ('E-mail testado com sucesso')
}).catch((err) => {
	logger.error('Erro ao testar e-mail! ' + err.message)
})

module.exports = transporter