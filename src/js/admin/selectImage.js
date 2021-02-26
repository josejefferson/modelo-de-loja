angular.module('store').controller('selectImageCtrl', ['$scope', ($scope) => {
	$scope.loading = true
	$scope.images = []

	fetch('/json/images')
		.then(r => { if (!r.ok) throw r; return r.json() })
		.then(r => {
			$scope.images = r.images
			$scope.loading = false
			$scope.$apply()
		})
}])