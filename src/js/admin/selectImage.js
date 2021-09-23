angular.module('store').controller('selectImageCtrl', ['$scope', ($scope) => {
	$scope.loading = true
	$scope.images = []

	fetch('/images/api')
		.then(r => { if (!r.ok) throw r; return r.json() })
		.then(r => {
			$scope.images = r
			$scope.loading = false
			$scope.$apply()
		})
}])