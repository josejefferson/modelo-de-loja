angular.module('store').controller('historyCtrl', ['$scope', ($scope) => {
	$scope.keys = Object.keys
	$scope.moment = window.moment
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
})

function filter(env) {
	return r => {
		switch (env) {
			case 'history': return true
			case 'notRejected': return r.status === 'pending' || r.status === 'confirmed'
		}
	}
}

window.setInterval(() => {
	document.querySelectorAll('.momentUpdate').forEach(e => {
		e.innerText = moment(e.dataset.time).fromNow()
	})
}, 5000)