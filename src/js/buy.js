document.buy.onsubmit = async function (e) {
	e.preventDefault()
	if (!await ask('Finalizar compra', 'Tem certeza que deseja finalizar esta compra? Após clicar em "Sim" seu pedido será enviado para o administrador do site e ele analisará e confirmará se os dados estão corretos para entregar os produtos na sua casa')) return
	Cookies.set('cart', '', { expires: 3650 })
	this.submit()
}

angular.module('store').controller('buyCtrl', ['$scope', ($scope) => {
	$scope.products = serverData
	$scope.inc = (e, max) => $scope.products[e].qtd =
		(++$scope.products[e].qtd > (max !== -1 ? max : Infinity)) ?
			max : $scope.products[e].qtd
	$scope.dec = e => $scope.products[e].qtd = --$scope.products[e].qtd || 1
	$scope.sum = () => {
		let sum = 0
		for (const i in $scope.products) {
			sum += $scope.products[i].quantity * $scope.products[i].price
		}
		return '(R$ ' + sum.toFixed(2).toString().replace('.', ',') + ')'
	}
}]).filter('money', () => {
	return input => {
		return input.toFixed(2).toString().replace('.', ',')
	}
})