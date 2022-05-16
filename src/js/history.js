angular.module('store').controller('historyCtrl', ['$scope', '$element', ($scope) => {
	const socket = io(location.origin + '/history')
	socket.on('connect', () => {
		console.log('[SOCKET] Conectado')
		for (id in serverData) socket.emit('id', id)
	})
	socket.on('confirm', data => {
		const request = $scope.requests[data.clientId].find(i => i._id === data.requestId)
		if (!request) return
		switch (data.action) {
			case 'confirm':
				request.status = 'confirmed'
				toast(`O pedido de "${request.clientId.name}" do produto "${request.productId.name}" foi confirmado`)
				break
			case 'reject':
				request.status = 'rejected'
				toast(`O pedido de "${request.clientId.name}" do produto "${request.productId.name}" foi rejeitado`, 'error')
				break
			case 'done':
				request.open = false
				toast(`O pedido de "${request.clientId.name}" do produto "${request.productId.name}" foi fechado`, 'warning')
				break
			case 'feedback':
				request.feedback = data.feedback
				if (data.feedback) toast(`Foi adicionado um comentário ao pedido de "${request.clientId.name}" do produto ` +
					`"${request.productId.name}"`, 'info', 'comment-alt')
				break
		}
		new Audio('/sounds/tone.wav').play()
		$scope.$apply()
	})

	$scope.keys = Object.keys
	$scope.dayjs = window.dayjs
	$scope.requests = serverData
	$scope.sum = (reqs) => {
		return 'R$ ' + reqs.reduce((total, req) => {
			return total += req.quantity * req.productId.price
		}, 0).toFixed(2).toString().replace('.', ',')
	}
	$scope.cancel = async (req, clientId) => {
		if (!await ask('Cancelar pedido',
			'Tem certeza que deseja cancelar este pedido?')) return

		fetch('/requests/cancel/' + req._id, {
			method: 'POST',
			body: JSON.stringify({ clientId }),
			headers: { 'Content-Type': 'application/json' }
		}).then(r => { if (!r.ok) throw r; return r.json() })
			.then(() => {
				const i = $scope.requests[clientId].indexOf(req)
				if (i > -1) $scope.requests[clientId].splice(i, 1)
				toast('Pedido cancelado')
				$scope.$apply()
			})
	}
	$scope.getRating = (ratings, client) => {
		return ratings.find(r => r.client == client)?.rating || 0
	}
	$scope.rate = (e, stars) => Rating()(stars, e.target.parentElement)
}])

angular.module('store').filter('users', () => {
	return (input, env) => {
		const output = {}
		for (key in input) {
			if (input[key].some(filter(env))) {
				output[key] = input[key]
			}
		}
		return output
	}
})

angular.module('store').filter('reqs', () => {
	return (input, env) => input.filter(filter(env))
})

angular.module('store').filter('money', () => {
	return (input) => input.toFixed(2).toString().replace('.', ',')
})

angular.module('store').filter('url', () => encodeURIComponent)

function filter(env) {
	return r => {
		switch (env) {
			case 'history': return true
			case 'notRejected': return r.status === 'pending' || r.status === 'confirmed'
		}
	}
}

window.setInterval(() => {
	document.querySelectorAll('.dayjsUpdate').forEach(e => {
		e.innerText = dayjs(e.dataset.time).fromNow()
	})
}, 5000)