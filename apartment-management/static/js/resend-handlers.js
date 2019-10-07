$('#resend-otp').click(function (){
	$(this).prop('disabled', true);
	const user_id = $(this).data('user_id');
	$.post(`/users/confirmotp/resend/${user_id}`, function(){
		console.log('resend success');
	}).done(() => {
		$('.resend-success-fail').append(
			`
			<div class="alert alert-success alert-dismissible fade show" role="alert">
			resend success. check your mail again.
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
					</button>
			</div>
			`
		)
	}).always(() => {
		$(this).prop('disabled', false);
	})
});