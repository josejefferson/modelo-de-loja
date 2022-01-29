angular.module('store').controller('fileUploadCtrl', ['$scope', '$rootScope', ($scope, $rootScope) => {
	FilePond.registerPlugin(
		FilePondPluginFileValidateSize,
		FilePondPluginFileValidateType
	)

	FilePond.setOptions({ ...FilePond.translation })

	FilePond.create(document.querySelector('.filepond'), {
		credits: false,
		labelFileProcessingError: (err) => error.body,
		server: {
			process,
			revert: (id, load, error) => {
				axios.get('/images/remove/' + id).then(load).catch(error)
			}
		}
	})

	function process(fieldName, file, metadata, load, error, progress, abort, transfer, options) {
		const source = axios.CancelToken.source()
		const form = new FormData()
		form.append('files', file)

		axios.post('/images/upload', form, {
			cancelToken: source.token,
			onUploadProgress: (e) => {
				progress(e.lengthComputable, e.loaded, e.total)
			}
		}).then((r) => {
			if (!r.data.success || r.data.invalid) throw r.err || ''
			$rootScope.$broadcast('upload', { id: r.data.id })
			$scope.$apply()
			load(r.data.id)
		}).catch((err) => {
			if (err.response && err.response.data && err.response.data.error) {
				err.message = err.response.data.error.message
			}
			error(err.message || 'Ocorreu um erro ao enviar o arquivo')
		})

		return {
			abort: () => {
				source.cancel()
				abort()
			}
		}
	}
}])