const mongoose = require('mongoose')
const LOCAL_DB = 'mongodb://localhost'
const TEST_DB = 'mongodb+srv://eu:jefftestesjeff@cluster0.et1uf.mongodb.net/Cluster0?retryWrites=true&w=majority'
const REMOTE_DB = ''

module.exports = mongoose.connect(TEST_DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}).then(() => console.log('>> [MongoDB] Conectado'))
	.catch(console.error)