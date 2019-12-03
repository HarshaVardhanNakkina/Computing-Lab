$('[id=approve-payment-rec-btn]').each(function() {
	$(this).click(event => {
		const _id = $(this).attr('data-id');
		const url = '/users/treasurer/approve-payment-record'
		const data = {_id: _id}
		let msgDiv = $(this).parents('#payment-rec-container').siblings('.update-success-fail')

		$.post(url, data, function(){}).done(res => {
			console.log(res.msg);
			msgDiv.append(
				`
				<div class='alert alert-success alert-dismissible text-center fade show' role='alert'>
					${typeof res === 'undefined' ? 'Success' : res.msg}
				<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
						</button>
				</div>
			`
			)

		}).fail(err => {
			console.error(err.msg)
			msgDiv.append(
				`
				<div class='alert alert-danger alert-dismissible text-center fade show' role='alert'>
				${typeof err === 'undefined' ? 'Error occured': err.msg}
				<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
						</button>
				</div>
			`
			)
		})
	})
})