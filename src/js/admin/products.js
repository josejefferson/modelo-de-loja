$('.remove').click(function () {
	Swal.fire({
		title: 'Excluir produto',
		text: 'Tem certeza que deseja excluir este produto?',
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: 'Sim',
		denyButtonText: 'Não'
	}).then(r => {
		if (!r.isConfirmed) return
		$this = $(this)
		productId = $this.data('productId')
		location.href = '/products/remove/' + productId
	})
})