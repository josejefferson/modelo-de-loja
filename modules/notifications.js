const io = require('./sockets').io
const cookie = require('cookie')
const Notification = require('mongoose').model('Notifications')


io.of('/notifications').use((socket, next) => {
	const cookies = cookie.parse(socket.request.headers.cookie || '')
	socket.cookies = cookies
	next()
})

io.of('/notifications').on('connection', (socket) => {
	const userIDs = (socket.cookies.userIds.split(',') || []).filter(userID => /^[A-Fa-f0-9]{24}$/.test(userID))
	for (const userID of userIDs) {
		socket.join(userID)
	}

	Notification.find({ client: userIDs }).then((notifications) => {
		console.log(notifications)
	})
})

module.exports = {
	notifications: io.of('/notifications')
}