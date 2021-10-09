angular.module('store', []).controller('productsEditCtrl', ['$scope', '$compile', ($scope, $compile) => {
	$scope.product = serverData || {
		media: []
	}
	$scope.remove = (item, parent) => {
		const i = parent.indexOf(item)
		if (i > -1) parent.splice(i, 1)
	}
	$scope.move = (arr, from, to) => {
		arr.move(from, to)
	}
	$scope.selectImageModal = () => {
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
			willOpen: popup => {
				angular.element(popup.querySelector('.swal2-content')).append(html)
			},
			preConfirm: () => {
				const imageId = document.querySelector('.selectedImage:checked')
				if (!imageId) return
				$scope.product.media.push({ type: 'image', url: '/images/view/' + imageId.value })
				$scope.$apply()
			}
		})
	}
	$scope.selectImageURLModal = async () => {
		const { value } = await Swal.fire({
			title: 'Inserir URL de imagem',
			text: 'Digite ou cole o link da imagem',
			input: 'text',
			showCancelButton: true,
			confirmButtonText: 'Inserir',
			cancelButtonText: 'Cancelar'
		})
		if (!value) return
		$scope.product.media.push({ type: 'image', url: value })
		$scope.$apply()
	}
	$scope.uploadModal = () => {
		const html = $compile('<ng-include src="\'/templates/upload.html\'"></ng-include>')($scope)
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
	$scope.selectYouTubeModal = () => {
		const html = $compile('<ng-include src="\'/templates/select-youtubeo.html\'"></ng-include>')($scope)
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

Array.prototype.move = function (from, to) {
	const element = this[from]
	this.splice(from, 1)
	this.splice(to, 0, element)
}