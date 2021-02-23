$('.remove').click(async function () {
	if (!await ask('Remover administrador', 'Tem certeza que deseja remover este administrador?')) return
	$this = $(this)
	adminId = $this.data('adminId')
	location.href = '/admins/remove/' + adminId
})