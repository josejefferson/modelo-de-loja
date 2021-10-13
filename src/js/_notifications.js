const notificationsSocket = io(location.origin + '/notifications')
notificationsSocket.on('connect', () => {
	console.log('[Notifications Socket] Conectado')
})

const $openNotifications = document.querySelector('.open-notifications')
const popover = new bootstrap.Popover($openNotifications, {
	container: 'body',
	html: true,
	content: document.querySelector('.notifications-popover-content'),
	customClass: 'notifications-popover'
})

angular.module('store').controller('notificationsCtrl', ['$scope', '$compile', ($scope, $compile) => {

	$scope.notifications = []
	$scope.unreadNotificationCount = () => {
		return $scope.notifications.filter((n) => !n.read).length
	}
	$scope.notificationsOpened = false

	notificationsSocket.on('notifications', (notifications) => {
		notifications.reverse()
		$scope.notifications = notifications
		$scope.$apply()
	})

	notificationsSocket.on('notification', (notification) => {
		$scope.notifications.unshift(notification)
		$scope.$apply()
		if ($scope.notificationsOpened) {
			notificationsSocket.emit('read')
		}
	})

	$openNotifications.addEventListener('show.bs.popover',() => {
		$scope.notificationsOpened = true
		notificationsSocket.emit('read')
	})

	$openNotifications.addEventListener('hidden.bs.popover',() => {
		$scope.notificationsOpened = false
		for (const notification of $scope.notifications) {
			notification.read = true
		}
		$scope.$apply()
	})
}])