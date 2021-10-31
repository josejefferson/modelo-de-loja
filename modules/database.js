const mongoose = require('mongoose')
const logger = require('@modules/logger')('MongoDB')

let mongoDBURL = process.env.NODE_ENV === 'development' ? 'mongodb://localhost' : process.env.MONGO_DB
if (!mongoDBURL) {
	logger.warn('O link do banco de dados remoto não foi definido')
	mongoDBURL = 'mongodb://localhost'
}

mongoose.connection.on('connecting', () => logger.info('Conectando...'))
mongoose.connection.on('connected', () => logger.succ('Conectado'))
mongoose.connection.on('disconnected', () => logger.fail('Desconectado'))
mongoose.connection.on('error', (err) => {
	logger.error('Erro ao conectar! ' + err.message, 'red')
	setTimeout(mongoConnect, 5000)
})
function mongoConnect() {
	mongoose.connect(mongoDBURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).catch(() => { })
}

mongoConnect()

require('@models/Ad')
require('@models/Admin')
require('@models/Client')
require('@models/Highlight')
require('@models/Image')
require('@models/Notification')
require('@models/Product')
require('@models/Request')