const mongoose = require('mongoose')
module.exports = mongoose.connect('mongodb+srv://eu:jefftestesjeff@cluster0.et1uf.mongodb.net/Cluster0?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log('>> [MongoDB] Conectado'))
.catch(err => console.error(err))