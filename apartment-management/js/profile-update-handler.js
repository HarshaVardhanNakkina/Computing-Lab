import { fail } from "assert";

$('#profile-details-form').submit(function(event) {
	event.preventDefault();

	let submitButton = $('#update-profile-btn');
	submitButton.prop('disabled', true);
	let url = $(this).attr('action');
	
	//{name: "", value: ""}
	let updatedProfile = $(this).serializeArray().reduce((acc, cur)=>{
		return {...acc,  [cur.name]: cur.value };
	},{});
	
	$.post(url,  updatedProfile , function(){}).done(() => {
		console.log('profile updated');
		$('.update-success-fail').append(
			`
				<div class="alert alert-success alert-dismissible text-center fade show" role="alert">
					Updated profile successfully.
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
				</div>
			`
		)
	})
	.fail(() => {
		$('.update-success-fail').append(
			`
				<div class="alert alert-success alert-dismissible text-center fade show" role="alert">
					Internal Server Error. Please try again.
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
				</div>
			`
		)
	})
	.always(() => {
		$('html, body').animate({scrollTop: 0}, 800, function(){});
		submitButton.prop('disabled', false);
	})
});
