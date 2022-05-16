const { Server } = require('socket.io')
const logger = require('@modules/logger')('Socket.IO')
let io = null

module.exports = {
	get io() { return io },
	start: (server) => {
		io = new Server(server)
		logger.info('Aberto na porta 3000')
		return io
	}
}