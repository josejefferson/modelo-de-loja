$('.quantity').on('keyup change', function () {
	const price = parseFloat($(this).closest('.product').data('price'))
	const quantity = $(this).val()
	const total = quantity * price
	$(this).closest('.product').find('.total').text(total.toLocaleString(undefined, { minimumFractionDigits: 2 }))
})

$('.removeFromCart').click(function () {
	$this = $(this)
	const productId = $this.data('product')
	let cart = Cookies.get('cart')
	cart = cart.split(',')
	console.log(cart.indexOf(productId.toString()))
	cart.splice(cart.indexOf(productId.toString()), 1)
	Cookies.set('cart', cart.join(','))
	$('#products').val(cart.join(','))
	$this.closest('.product').slideUp('fast', function () { $(this).remove() })
	toast('O item foi removido do carrinho')
})

$('form').on('submit', function (e) {
	if (!confirm('Tem certeza que deseja realizar esta compra?')) return e.preventDefault()
})