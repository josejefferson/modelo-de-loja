const io = require('../sockets').io

io.of('/admins').on('connection', (socket) => {
	socket.emit('msg', 'Welcome')
})

module.exports = io.of('/admins')