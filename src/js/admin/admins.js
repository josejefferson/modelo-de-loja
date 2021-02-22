$('.remove').click(function () {
	Swal.fire({
		title: 'Remover administrador',
		text: 'Tem certeza que deseja remover este administrador?',
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: 'Sim',
		denyButtonText: 'Não'
	}).then(r => {
		if (!r.isConfirmed) return
		$this = $(this)
		adminId = $this.data('adminId')
		location.href = '/admins/remove/' + adminId
	})
})