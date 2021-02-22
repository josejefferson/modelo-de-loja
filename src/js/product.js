$('.addToCart').click(function () {
	const productID = $(this).data('product')
	cart({ add: productID })
	toast('O item foi adicionado ao carrinho')
	$(this).toggleClass('hidden')
	$(this).next().toggleClass('hidden')
})

$('.removeFromCart').click(function () {
	const productID = $(this).data('product')
	cart({ remove: productID })
	toast('O item foi removido do carrinho')
	$(this).toggleClass('hidden')
	$(this).prev().toggleClass('hidden')
})