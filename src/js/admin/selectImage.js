angular.module('store').controller('selectImageCtrl', ['$scope', ($scope) => {
	$scope.loading = true
	$scope.images = []
	$scope.getImages = getImages

	function getImages() {
		$scope.loading = true
		axios.get('/images/api')
		.then((r) => {
			$scope.images = r.data
			$scope.loading = false
			$scope.$apply()
		})
	}
	getImages()
}])