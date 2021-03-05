$('.addToCart').click(function () {
	const productID = $(this).data('product')
	cart({ add: productID })
	$(this).toggleClass('hidden')
	$(this).next().toggleClass('hidden')
})

$('.removeFromCart').click(function () {
	const productID = $(this).data('product')
	cart({ remove: productID })
	$(this).toggleClass('hidden')
	$(this).prev().toggleClass('hidden')
})