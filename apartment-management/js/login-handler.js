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
		let date = new Date();
		date.setTime(date.getTime() + (3*24*60*60*1000));
		var expires = "expires="+ date.toUTCString();
		document.cookie = `token=${data.token};expires=${expires};path=/`
	}).done(() => {
		window.location.replace(window.location.origin)
	})
	.fail(() => {
	})
	.always(() => {
		submitButton.prop('disabled', false);
	})
})