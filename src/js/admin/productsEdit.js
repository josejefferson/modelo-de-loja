angular.module('store').animation('.store-product-edit-media', () => ({ enter: anim.open, leave: anim.close }))

angular.module('store', []).controller('productsEditCtrl', ['$scope', '$compile', ($scope, $compile) => {
	$scope.uploads = []
	$scope.$on('upload', (event, arg) => {$scope.uploads.push(arg)})
	$scope.product = serverData || {media: []}
	$scope.remove = (item, parent) => {
		const i = parent.indexOf(item)
		if (i > -1) parent.splice(i, 1)
	}
	$scope.move = (arr, from, to) => {
		const element = arr[from]
		arr.splice(from, 1)
		arr.splice(to, 0, element)
	}
	$scope.selectMediaModal = () => {
		const html = $compile('<ng-include src="\'/templates/select-media.html\'"></ng-include>')($scope)
		Swal.fire({
			title: 'Selecionar mídia',
			width: '100%',
			padding: '20px 0',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonText: 'Selecionar',
			cancelButtonText: 'Cancelar',
			customClass: {
				popup: 'select-media'
			},
			willOpen: (popup) => {
				angular.element(popup.querySelector('.swal2-content')).append(html)
			},
			preConfirm: (...args) => {
				const selectedImages = document.querySelectorAll('.selected-media:checked')
				const selected = [...selectedImages].map((image) => {
					return { type: image.dataset.type || 'image.url', value: image.value }
				})
				return selected
			}
		}).then((result) => {
			if (!result.isConfirmed) return
			$scope.product.media.push(...result.value)
			$scope.$apply()		
		})
	}
}])

angular.module('store').filter('trusted', ['$sce', ($sce) => {
	return (url) => $sce.trustAsResourceUrl(url)
}])