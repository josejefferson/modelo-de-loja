const { Server } = require('socket.io')
const log = require('../Log')('Socket.IO', 'magenta')
let io = null

module.exports = {
	get io() { return io },
	start: (server) => {
		io = new Server(server)
		log('Aberto na porta 3000')
		return io
	}
}