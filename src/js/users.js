$('.remove').click(function () {
	Swal.fire({
		title: 'Remover usuário',
		text: 'Tem certeza que deseja remover este usuário?',
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: 'Sim',
		denyButtonText: 'Não'
	}).then(r => {
		if (!r.isConfirmed) return
		$this = $(this)
		clientId = $this.data('clientId')
		userIds = Cookies.get('userIds').split(',')
		userIds.splice(userIds.indexOf(clientId), 1)
		userIds = userIds.join(',')
		Cookies.set('userIds', userIds, { expires: 3650 })
		$this.closest('.user').slideUp('fast', function () { $(this).remove() })
	})
})