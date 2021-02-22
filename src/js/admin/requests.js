angular.module('store').controller('requestsCtrl', ['$scope', ($scope) => {
	$scope.moment = window.moment
	$scope.requests = serverData
	$scope.sum = (reqs) => {
		return 'R$ ' + reqs.reduce((total, req) => {
			return total += req.quantity * req.productId.price
		}, 0).toFixed(2).toString().replace('.', ',')
	}
	$scope.confirm = async (id, act, req) => {
		fetch('/requests/confirm/' + id, {
			method: 'POST',
			body: JSON.stringify({ confirm: act }),
			headers: { 'Content-Type': 'application/json' }
		}).then(() => {
			if (act === 'confirm' || act === 'reject') req.pending = false
			if (act === 'confirm') req.confirmed = true
			if (act === 'reject') req.confirmed = false
			if (act === 'done') req.done = true
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
			case 'pending': return !r.done
			case 'rejected': return !r.pending && !r.confirmed
			case 'closed': return r.done
			case 'notRejected': return r.pending || r.confirmed
		}
	}
}

window.setInterval(() => {
	document.querySelectorAll('.momentUpdate').forEach(e => {
		e.innerText = moment(e.dataset.time).fromNow()
	})
}, 5000)