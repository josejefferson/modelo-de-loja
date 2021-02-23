document.buy.onsubmit = async function (e) {
	e.preventDefault()
	if (!await ask('Finalizar compra', 'Tem certeza que deseja finalizar esta compra?')) return
	this.submit()
}

angular.module('store').controller('buyCtrl', ['$scope', ($scope) => {
	$scope.products = {}
	$scope.inc = (e, max) => $scope.products[e].qtd =
		(++$scope.products[e].qtd > (max !== -1 ? max : Infinity)) ?
			max : $scope.products[e].qtd
	$scope.dec = e => $scope.products[e].qtd = --$scope.products[e].qtd || 1
	$scope.sum = () => {
		let sum = 0
		for (const i in $scope.products) {
			sum += $scope.products[i].qtd * $scope.products[i].price
		}
		return '(R$ ' + sum.toFixed(2).toString().replace('.', ',') + ')'
	}
}])