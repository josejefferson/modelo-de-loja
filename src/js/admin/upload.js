angular.module('store').controller('fileUploadCtrl', ['$scope', ($scope) => {
	$scope.upload = {
		state: '',
		error: null,
		files: [],
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
					$scope.upload.state = ''
					$scope.upload.upload([...e.originalEvent.dataTransfer.files])
				}
			}
		},
		upload: (files) => {
			files.forEach(file => {
				const accept = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
				const fileStatus = {
					name: file.name || '(Desconhecido)',
					type: file.type || '(Desconhecido)',
					size: file.size || '(Desconhecido)',
					status: 'pending',
					errors: []
				}
				$scope.upload.files.push(fileStatus)

				if (!accept.includes(file.type)) {
					fileStatus.status = 'error'
					fileStatus.errors.push('O tipo do arquivo é incompatível')
				}
				if (file.size > 5242880) {
					fileStatus.status = 'error'
					fileStatus.errors.push('O tamanho do arquivo excede 5 MB')
				}
				if (fileStatus.status === 'error') return
				
				const form = new FormData()
				form.append('files', file)
				fileStatus.status = 'uploading'

				fetch('/images/upload', {
					method: 'POST',
					body: form
				}).then(r => { if (!r.ok) throw r; return r.json() })
					.then(r => {
						if (!r.success || r.invalid) throw r.err || ''
						fileStatus.status = 'success'
						$scope.$apply()
					}).catch(err => {
						fileStatus.status = 'error'
						fileStatus.errors.push(err || 'Ocorreu um erro ao enviar o arquivo')
						$scope.$apply()
					})
			})
		}
	}
	$scope.fileSize = input => {
		if (isNaN(input)) input = 0
		if (input < 1024) return input + ' bytes'
		input /= 1024
		if (input < 1024) return input.toFixed(2) + ' KB'
		input /= 1024
		if (input < 1024) return input.toFixed(2) + ' MB'
		input /= 1024
		if (input < 1024) return input.toFixed(2) + ' GB'
		input /= 1024
		return input.toFixed(2) + ' TB'
	}
}])