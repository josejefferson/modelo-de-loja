const io = require('../sockets').io
module.exports = actions = {}

io.of('/history').on('connection', (socket) => {
	socket.on('id', id => {
		socket.join(id)
	})
})

io.of('/requests')

actions.buy = (req, res, next) => {
	io.of('/requests').emit('newRequests', {
		clientId: req.data.clientUser._id,
		requests: req.data.requests
	}) // enviar informações completas do cliente
	next()
}

actions.confirm = (req, res, next) => {
	const request = req.data.request
	io.of('/history').to(request.clientId._id.toString()).emit('confirm', {
		clientId: request.clientId._id,
		requestId: request._id,
		action: req.body.confirm,
		...(req.body.feedback && { feedback: req.body.feedback })
	})
}