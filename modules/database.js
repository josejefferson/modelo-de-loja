const mongoose = require('mongoose')
const logger = require('./logger')('MongoDB')

const LOCAL_DB = 'mongodb://localhost'
const ONLINE_DB = 'mongodb+srv://eu:jefftestesjeff@cluster0.et1uf.mongodb.net/Cluster0?retryWrites=true&w=majority'

mongoose.connection.on('connecting', () => logger.info('Conectando...'))
mongoose.connection.on('connected', () => logger.succ('Conectado'))
mongoose.connection.on('disconnected', () => logger.fail('Desconectado'))
mongoose.connection.on('error', (err) => {
	logger.error('Erro ao conectar! ' + err.message, 'red')
	setTimeout(mongoConnect, 5000)
})
function mongoConnect() {
	mongoose.connect(process.env.DB == 'online' ? ONLINE_DB : LOCAL_DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).catch(() => { })
}

mongoConnect()

require('../models/Ad')
require('../models/Admin')
require('../models/Client')
require('../models/Highlight')
require('../models/Image')
require('../models/Product')
require('../models/Request')