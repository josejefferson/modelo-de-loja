if (!navigator.cookieEnabled)
	document.querySelector('.cookiesBlocked').classList.remove('hidden')

function cart(opts = {}) {
	let cart = Cookies.get('cart') ?
		Cookies.get('cart').split(',') :
		Cookies.set('cart', '', { expires: 3650 }) && []
	if (opts.set) cart = opts.set
	if (opts.add) cart.push(opts.add)
	if (opts.remove) {
		const i = cart.indexOf(opts.remove)
		if (i > -1) cart.splice(i, 1)
	}
	cart = [...new Set(cart)]
	Cookies.set('cart', cart.join(','), { expires: 3650 })
	return cart
}

function toast(msg = '', type = 'success', icon) {
	return Swal.fire({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		icon: type,
		title: msg,
		showCloseButton: true,
		...(icon && { iconHtml: `<i class="fas fa-${icon} fa-xs"></i>` })
	})
}

async function ask(title = '', text = '', input, value = '') {
	return (await Swal.fire({
		title,
		text,
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: !input ? 'Sim' : 'Enviar',
		denyButtonText: !input ? 'Não' : 'Cancelar',
		...(input && {
			input: 'text',
			inputValue: value
		})
	}))[!input ? 'isConfirmed' : 'value']
}

document.querySelector('.open-sidebar').addEventListener('click', toggleSidebar)
document.querySelector('.sidebar-background').addEventListener('click', toggleSidebar)
function toggleSidebar() {
	document.body.classList.toggle('sidebar-open')
}