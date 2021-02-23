angular.module('store', []).controller('productsEditCtrl', ['$scope', '$compile', ($scope, $compile) => {
	$scope.test = 'Hello World'
	$scope.loadController = () => {
		const html = $compile(uploadModal)($scope)
		Swal.fire({
			width: '100%',
			padding: '20px 0',
			showCloseButton: true,
			showConfirmButton: false,
			willOpen: popup => {
				angular.element(popup.querySelector('.swal2-content')).append(html)
			}
		})
	}
}])