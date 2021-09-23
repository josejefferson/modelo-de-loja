const mongoose = require('mongoose')
const log = require('../Log')('MongoDB', 'cyan')

const LOCAL_DB = 'mongodb://localhost'
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