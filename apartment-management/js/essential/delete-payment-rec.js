$('[id=delete-payment-rec-btn]').each(function() {
	$(this).click(event => {
		$(this).siblings('.confirm-before-delete').toggle(300, 'swing')
	})
})

$('[id=delete-yes]').each(function() {
	$(this).click(event => {
		const _userId = $(this).attr('data-id')
		console.log(_userId);
		$.ajax({
			url: '/users/treasurer/delete-payment-record',
			type: 'delete',
			data: { _userId },
			success: function (data, status, xhr) {
        window.location.replace(window.location.origin+`/users/treasurer/view-payments`)	
			}
		})
	})
})

$('[id=delete-no]').each(function() {
	$(this).click(event => {
		$(this).parents('.confirm-before-delete').toggle(300, 'swing')
	})
})