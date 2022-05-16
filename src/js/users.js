$('.remove').click(async function () {
	if (!await ask('Remover usuário', 'Tem certeza que deseja remover este usuário?')) return
	$this = $(this)
	clientId = $this.data('clientId')
	userIds = Cookies.get('userIds').split(',')
	userIds.splice(userIds.indexOf(clientId), 1)
	userIds = userIds.join(',')
	Cookies.set('userIds', userIds, { expires: 3650 })
	$this.closest('.user').slideUp('fast', function () { $(this).remove() })
})

$('.delete').click(async function () {
	if (!await ask('Excluir cliente', 'Tem certeza que deseja remover excluir este cliente?')) return
	$this = $(this)
	clientId = $this.data('clientId')
	location.href = '/clients/remove/' + clientId
})

$('#import').change(function () {
	if (this.files[0]) {
		readFile(this.files[0]).then((content) => {
			let userIds = Cookies.get('userIds')
			if (userIds) userIds = userIds.split(',')
			else userIds = []
			let clients = userIds.concat(content.split(','))
			clients = clients.filter((client) => {
				return client.length === 24 && /^[0-9a-f]+$/.test(client)
			})
			clients = [...new Set(clients)]
			Cookies.set('userIds', clients.join(','), { expires: 3650 })
			location.reload()
		})
	}
})

$('.export').click(function () {
	const userIDs = Cookies.get('userIds')
	const blob = new Blob([userIDs], { type: 'text/plain' })
	const $link = document.createElement('a')
	$link.href = URL.createObjectURL(blob)
	$link.download = 'Clientes do Modelo de Loja.txt'
	document.body.appendChild($link)
	$link.click()
	document.body.removeChild($link)
})

function readFile(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader()
		reader.onload = () => {
			resolve(reader.result)
		}
		reader.onerror = reject
		reader.readAsText(file)
	})
}