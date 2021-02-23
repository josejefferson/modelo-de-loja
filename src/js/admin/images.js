$('.remove').click(async function () {
	if (!await ask('Remover imagem', 'Tem certeza que deseja remover esta imagem?')) return
	$this = $(this)
	imageId = $this.data('imageId')
	location.href = '/images/remove/' + imageId
})

angular.module('store', []).controller('imagesCtrl', ['$scope', '$compile', ($scope, $compile) => {
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