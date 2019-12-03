$('[id=approve-notice]').each(function() {
	$(this).click((event) => {
		const id = $(this).attr('data-id')
		const url = '/users/president/approve-notice'
		$.post(url, {id: id}, function(){}).done(res => {
			$(this).siblings('.approve-success-fail').append(
				`
				<div class="alert alert-success alert-dismissible fade show" role="alert">
				${res.msg}
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
				</div>
				`
			)
		}).fail(err => {
			$(this).siblings('.approve-success-fail').append(
				`
				<div class="alert alert-success alert-dismissible fade show" role="alert">
				${res.msg}
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
				</div>
				`
			)
		})
	})
})