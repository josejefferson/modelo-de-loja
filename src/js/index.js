if (!navigator.cookieEnabled) {
	document.querySelector('.store-cb').classList.remove('hidden')
}

angular.module('store', ['ngAnimate'])

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

function htmlDecode(input) {
	var doc = new DOMParser().parseFromString(input, 'text/html')
	return doc.documentElement.textContent
}

// DADOS DO SERVIDOR
window.addEventListener('load', () => {
	const $serverData = document.querySelector('script.server-data')
	if ($serverData) try {
		const serverData = JSON.parse(htmlDecode($serverData.textContent))
		window.serverData = serverData
	} catch (err) {
		console.error(err)
	}
})

// TOASTS
window.addEventListener('load', async () => {
	const $toasts = document.querySelector('script.toasts')
	if ($toasts) try {
		const toasts = JSON.parse(htmlDecode($toasts.textContent))
		for (const type in toasts) {
			for (const text of toasts[type]) {
				await toast(text, type)
			}
		}
	} catch (err) {
		console.error(err)
	}
})