$('[id=approve-user-btn]').each(function() {
	$(this).click(function(event){
		const user_id = $(this).attr('data-id')
		// console.log($(this))
		console.log(user_id)
		const url = '/users/president/approve-user/'
		$.post(url, {user_id}, function() {}).done((res) => {
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
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
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