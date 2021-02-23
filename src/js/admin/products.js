$('.remove').click(async function () {
	if (!await ask('Excluir produto', 'Tem certeza que deseja excluir este produto?')) return
	$this = $(this)
	productId = $this.data('productId')
	location.href = '/products/remove/' + productId
})