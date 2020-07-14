const successToast = (msg) => `
	<div class="toast toast-success" data-delay="10000">
		<div class="toast-header bg-success text-white">
			<strong class="mr-auto">Sucesso</strong>
			<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
				<span class="text-white">&times;</span>
			</button>
		</div>
		<div class="toast-body">
			<ul class="fa-ul ml-4 mb-0">
				<li><span class="fa-li"><i class="fas fa-check-circle"></i></span> ${msg}</li>
			</ul>
		</div>
	</div>
`

const errorToast = (msg) => `<div class="toast toast-error" data-delay="10000">
		<div class="toast-header bg-danger text-white">
			<strong class="mr-auto">Erro</strong>
			<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
				<span class="text-white">&times;</span>
			</button>
		</div>
		<div class="toast-body">
			<ul class="fa-ul ml-4 mb-0">
				<li><span class="fa-li"><i class="fas fa-exclamation-triangle"></i></span> ${msg}</li>
			</ul>
		</div>
	</div>
`

function toast(msg, type = 'success') {
	switch (type) {
		case 'success': $('.toast-alert').html(successToast(msg)); $('.toast-success').toast('show'); break;
		case 'error': $('.toast-alert').html(errorToast(msg)); $('.toast-error').toast('show'); break;
	}
}