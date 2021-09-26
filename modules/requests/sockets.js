const io = require('../sockets').io

io.of('/history').on('connection', socket => {
	socket.on('id', id => {
		socket.join(id)
	})
})

module.exports = {
	requests: io.of('/requests'),
	history: io.of('/history')
}