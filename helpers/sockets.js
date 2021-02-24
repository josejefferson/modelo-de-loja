module.exports = io => {
	io.of('/history').on('connection', socket => {
		socket.on('id', id => {
			socket.join(id)
		})
	})

	// io.of('/namespace').to('room').emit()
}