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