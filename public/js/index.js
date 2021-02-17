function cart(opts = {}) {
	let cart = Cookies.get('cart') ?
		Cookies.get('cart').split(',') :
		Cookies.set('cart', '', { expires: 30 }) && []
	if (opts.set) cart = opts.set
	if (opts.add) cart.push(opts.add)
	if (opts.remove) {
		const i = cart.indexOf(opts.remove)
		if (i > -1) cart.splice(i, 1)
	}
	cart = [...new Set(cart)]
	Cookies.set('cart', cart.join(','))
	return cart
}

function toast(msg, type = 'success') {
	return Swal.fire({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		icon: type,
		title: msg,
		showCloseButton: true
	})
}