angular.module('store', []).controller('productsEditCtrl', ['$scope', '$compile', ($scope, $compile) => {
	$scope.media = []
	$scope.remove = (item, parent) => {
		const i = parent.indexOf(item)
		if (i > -1) parent.splice(i, 1)
	}
	$scope.selectImageModal = () => {
		const html = $compile(selectImageModal)($scope)
		Swal.fire({
			title: 'Selecionar imagem',
			width: '100%',
			padding: '20px 0',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonText: 'Selecionar',
			cancelButtonText: 'Cancelar',
			willOpen: popup => {
				angular.element(popup.querySelector('.swal2-content')).append(html)
			},
			preConfirm: () => {
				const imageId = document.querySelector('.selectedImage:checked').value
				if (!imageId) return
				$scope.media.push({ type: 'image', url: '/images/' + imageId })
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
		$scope.media.push({ type: 'image', url: value })
		$scope.$apply()
	}
	$scope.uploadModal = () => {
		const html = $compile(uploadImageModal)($scope)
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
		const html = $compile(selectYouTubeModal)($scope)
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