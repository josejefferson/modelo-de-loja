angular.module('store').animation('.store-requests-client', () => ({ enter: anim.open, leave: anim.close }))
angular.module('store').animation('.store-requests-client-product', () => ({ enter: anim.open, leave: anim.close }))

angular.module('store').controller('requestsCtrl', ['$scope', ($scope) => {
	const socket = io(location.origin + '/requests')
	socket.on('connect', () => {
		console.log('[SOCKET] Conectado')
	})
	socket.on('newRequests', requests => {
		const existentClient = $scope.requests[requests.clientId] ? true : false

		requests.requests.forEach(request => {
			$scope.requests[requests.clientId] = $scope.requests[requests.clientId] || []
			$scope.requests[requests.clientId].unshift(request)
			$scope.$apply()
			toast(`Novo pedido do usuário "${request.clientId.name}"`, 'info')
		})

		if (!existentClient) {
			new Audio('/sounds/doorBell.wav').play()
		}
		else {
			new Audio('/sounds/deskBell.wav').play()
		}
	})

	$scope.keys = Object.keys
	$scope.dayjs = window.dayjs
	$scope.requests = serverData
	$scope.sum = (reqs) => {
		return 'R$ ' + reqs.reduce((total, req) => {
			return total += req.quantity * req.productId.price
		}, 0).toFixed(2).toString().replace('.', ',')
	}
	$scope.confirm = async (req, act, feedback) => {
		if (act === 'done' && req.status !== 'pending' && !await ask('Fechar pedido',
			'Tem certeza que deseja fechar este pedido? Não será possível modificá-lo depois!')) return

		if (act === 'done' && req.status === 'pending' && !await ask('Confirmar e fechar pedido',
			'Você não confirmou ou recusou o pedido. Se você continuar o pedido será confirmado ' +
			'automaticamente e fechado. Depois de fechado não será possível fazer modificações.')) return

		if (act === 'feedback' && [false, undefined].includes(feedback = await ask('Enviar feedback',
			'Digite uma mensagem para enviar ao cliente', true, req.feedback))) return

		confirm($scope, req, act, feedback)
	}
	$scope.confirmAll = async (reqs, act, feedback) => {
		if (act === 'confirm' && !await ask('Confirmar pedidos',
			'Tem certeza que deseja confirmar estes pedidos?')) return

		if (act === 'reject' && !await ask('Rejeitar pedidos',
			'Tem certeza que deseja rejeitar estes pedidos?')) return

		if (act === 'done' && !await ask('Fechar pedidos',
			'Tem certeza que deseja fechar estes pedidos? Não será possível modificá-los depois!')) return

		if (act === 'feedback' && (feedback = await ask('Enviar feedback',
			'Digite uma mensagem para enviar ao cliente', true)) === false) return

		reqs.filter(r => r.open).forEach(req => confirm($scope, req, act, feedback))
	}
}]).filter('users', () => {
	return (input, env) => {
		const output = {}
		for (key in input)
			if (input[key].some(filter(env)))
				output[key] = input[key]
		return output
	}
}).filter('reqs', () => {
	return (input, env) => {
		return input.filter(filter(env))
	}
}).filter('money', () => {
	return input => {
		return input.toFixed(2).toString().replace('.', ',')
	}
}).filter('url', () => encodeURIComponent)

async function confirm($scope, req, act, feedback) {
	fetch('/requests/confirm/' + req._id, {
		method: 'POST',
		body: JSON.stringify({
			confirm: act,
			...(feedback && { feedback })
		}),
		headers: { 'Content-Type': 'application/json' }
	}).then(r => { if (!r.ok) throw r; return r.json() })
		.then(() => {
		if (act === 'confirm') req.status = 'confirmed'
		if (act === 'reject') req.status = 'rejected'
		if (act === 'feedback') req.feedback = feedback
		if (act === 'done') {
			if (req.status === 'pending') req.status = 'confirmed'
			req.open = false
		}
		$scope.$apply()
	})
}

function filter(env) {
	return r => {
		switch (env) {
			case 'pending': return r.open
			case 'rejected': return r.status === 'rejected'
			case 'closed': return !r.open
			case 'notRejected': return r.status === 'pending' || r.status === 'confirmed'
		}
	}
}

window.setInterval(() => {
	document.querySelectorAll('.dayjsUpdate').forEach(e => {
		e.innerText = dayjs(e.dataset.time).fromNow()
	})
}, 5000)