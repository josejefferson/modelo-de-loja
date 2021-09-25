const mongoose = require('mongoose')
const log = require('./log')('MongoDB', 'cyan')

const LOCAL_DB = 'mongodb://localhost'
const ONLINE_DB = 'mongodb+srv://eu:jefftestesjeff@cluster0.et1uf.mongodb.net/Cluster0?retryWrites=true&w=majority'

mongoose.connection.on('connecting', () => log('Conectando...'))
mongoose.connection.on('connected', () => log('Conectado', 'green'))
mongoose.connection.on('disconnected', () => log('Desconectado'))
mongoose.connection.on('error', (err) => {
	log('Erro ao conectar!\n' + err.message, 'red')
	setTimeout(mongoConnect, 5000)
})
function mongoConnect() {
	mongoose.connect(LOCAL_DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).catch((err) => {
		log(err.toString(), 'red')
	})
}

mongoConnect()

require('../models/Ad')
require('../models/Admin')
require('../models/Client')
require('../models/Highlight')
require('../models/Image')
require('../models/Product')
require('../models/Request')