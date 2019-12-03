$('#login-form').submit(function(event){
	console.log("YAY LOGIN SUBMITTED")
	event.preventDefault()
	const submitButton = $('#login-btn')
	submitButton.prop('disabled', true)
	const formData = $(this).serializeArray().reduce((acc, cur)=>{
		return {...acc,  [cur.name]: cur.value };
	},{})
	const url = $(this).attr('action')
	$.post(url, formData, function(data){
		const { firstTimeLogin, role } = data;
		console.log(firstTimeLogin)
		if (firstTimeLogin){
			window.location.replace(window.location.origin+`/users/profile/edit`)	
		}else
			window.location.replace(window.location.origin)
		// let date = new Date();
		// date.setTime(date.getTime() + (3*24*60*60*1000));
		// var expires = "expires="+ date.toUTCString();
		// document.cookie = `token=${data.token};expires=${expires};path=/`
	})
	.fail((res) => {
		const { responseJSON } =  res;
		const { message } = responseJSON;
		$('.update-success-fail').append(
			`
				<div class='alert alert-danger alert-dismissible text-center fade show' role='alert'>
					${message}
				<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
						</button>
				</div>
			`
		)
	})
	.always(() => {
		submitButton.prop('disabled', false);
	})
})