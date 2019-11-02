$('#tenant-details-form').submit(function(event){
	console.log("TENANT IS UPDATING");
	event.preventDefault();
	let submitButton = $('update-tenant-btn');
	submitButton.prop('disabled', true);
	let url = $(this).attr('action');
	let updatedTenant = $(this).serializeArray().reduce((acc,cur)=>{
		return {...acc, [cur.name]: cur.value };
	},{});
	console.log(updatedTenant, url);
	$.post(url, updatedTenant, function(){}).done(() => {
		$('.update-success-fail').append(
			`
				<div class='alert alert-success alert-dismissible text-center fade show' role='alert'>
					Updated successfully.
				<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
						</button>
				</div>
			`
		)
	})
	.fail(() => {
		$('.update-success-fail').append(
			`
				<div class='alert alert-success alert-dismissible text-center fade show' role='alert'>
					Internal Server Error. Please try again.
				<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
						</button>
				</div>
			`
		)
	})
	.always(() => {
		$('html, body').animate({scrollTop: 0}, 800, function(){});
		submitButton.prop('disabled', false);
	})
})