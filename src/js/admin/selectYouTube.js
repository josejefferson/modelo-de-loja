angular.module('store').controller('selectYouTubeCtrl', ['$scope', ($scope) => {
	$scope.youtubeID = null
	$scope.getYTID = (url) => {
		return $scope.youtubeID = parseYTURL(url)
	}
}])

function parseYTURL(url) {
	if (/^[A-Za-z0-9_-]{11}$/g.test(url)) return url
	const result = urlParser.parse(url)
	if (!result) return null
	return result.id
}