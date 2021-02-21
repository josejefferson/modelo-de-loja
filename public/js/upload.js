angular.module('store').controller('fileUploadCtrl', ['$scope', ($scope) => {
	$scope.upload = {
		state: '',
		error: null,
		change: (e) => {
			$scope.upload.upload([...e.target.files])
			e.target.value = ''
		},
		event: (e) => {
			e.preventDefault()
			e.stopPropagation()
		return {
				dragenter: (e) => { $scope.upload.state = 'highlight' },
				dragover: (e) => { $scope.upload.state = 'highlight' },
				dragleave: (e) => { $scope.upload.state = '' },
				drop: (e) => {
					$scope.upload.state = '';
					$scope.upload.upload([...e.dataTransfer.files])
				}
			}
		},
		upload: (files) => {
			const form = new FormData()
			files.forEach(file => form.append('files', file))
			$scope.upload.state = 'uploading'
			fetch('/images/upload', {
				method: 'POST',
				body: form
			}).then(r => { if (!r.ok) throw r; return r.json() })
				.then(() => {
					$scope.upload.state = 'success'
					$scope.$apply()
				}).catch(() => {
					$scope.upload.state = 'error'
					$scope.$apply()
				})
		}
	}
}])