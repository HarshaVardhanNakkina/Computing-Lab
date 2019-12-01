$('[id=create-payment-rec-btn').each(function() {
	$(this).click(event => {
		// console.log($(this).attr('data-id'))
		const id = $(this).attr('data-id')
		// window.location.replace(window.location.origin + `/users/treasurer/create-payment-record/${id}`)
		$(this).siblings('.payment-record-details').toggle(300, 'swing')

	})
})

$('[id=create-payment-rec-form]').each(function() {
	$(this).submit( event => {
		event.preventDefault()
		const url = $(this).attr('action')
		const paymentDetails = $(this).serializeArray().reduce((acc, cur)=>{
			return {...acc,  [cur.name]: cur.value }
		},{});

		let msgDiv = $(this).parents('#payment-rec-container').siblings('.update-success-fail')

		$.post(url, paymentDetails, function(){}).done(data => {
			
			// $(this).trigger('reset')
		
			msgDiv.append(
				`
				<div class='alert alert-success alert-dismissible text-center fade show' role='alert'>
					${typeof data === 'undefined' ? 'Success' : data.msg}
				<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
						</button>
				</div>
			`
			)

		}).fail(data => {
			msgDiv.append(
				`
				<div class='alert alert-danger alert-dismissible text-center fade show' role='alert'>
				${typeof data === 'undefined' ? 'Error occured': data.msg}
				<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
						</button>
				</div>
			`
			)
		})

	})
})
