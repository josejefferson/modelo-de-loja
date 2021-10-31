const io = require('@modules/sockets').io
const cookie = require('cookie')
const Notification = require('mongoose').model('Notifications')


io.of('/notifications').use((socket, next) => {
	const cookies = cookie.parse(socket.request.headers.cookie || '')
	socket.cookies = cookies
	next()
})

io.of('/notifications').on('connection', (socket) => {
	const userIDs = (socket.cookies.userIds.split(',') || []).filter((userID) => /^[A-Fa-f0-9]{24}$/.test(userID))
	for (const userID of userIDs) {
		socket.join(userID)
	}

	Notification.find({ client: userIDs }).then((notifications) => {
		socket.emit('notifications', notifications)
	}).catch((err) => {
		console.error(err)
	})

	socket.on('read', () => {
		Notification.find({ client: userIDs, read: false }).then((notifications) => {
			return Promise.all(notifications.map((notification) => {
				notification.read = true
				return notification.save().catch(() => {})
			}))
		}).then((notifications) => {
			// console.log(notifications)
		})
	})

	// temp
	socket.on('send', (notification) => {
		Notification.create(notification).then((notification) => {
			socket.emit('notification', notification)
		})
	})
})

module.exports = {
	notifications: io.of('/notifications')
}