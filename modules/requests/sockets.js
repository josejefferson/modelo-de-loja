const io = require('../sockets').io

io.of('/history').on('connection', socket => {
	socket.on('id', id => {
		console.log(id)
		socket.join(id)
	})
})

io.of('/requests').on('connection', (socket) => {
	socket.emit('msg', 'Welcome')
})

module.exports = {
	requests: io.of('/requests'),
	history: io.of('/history')
}