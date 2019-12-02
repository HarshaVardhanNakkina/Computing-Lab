$('#register-form').submit(function(event){
	event.preventDefault()
	let submitButton = $('#register-btn')
	submitButton.prop('disabled', true)
	const url = $(this).attr('action')
	console.log(url)
	const formData = $(this).serializeArray().reduce((acc, cur)=>{
		return {...acc,  [cur.name]: cur.value }
	},{})
	$.post(url, formData, function(data){
		const {_userId } = data;
		window.location.replace(window.location.origin + `/users/confirmotp/${_userId}`)
	}).fail(function(data){
		if (data.responseJSON.length) {
			data.responseJSON.forEach(el => {

				$('.update-success-fail').append(
					`
						<div class='alert alert-danger alert-dismissible text-center fade show' role='alert'>
							${el.msg}
						<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
								</button>
						</div>
					`
				)
			})

		}
	}).always(() => {
		submitButton.prop('disabled', false);
	})
})