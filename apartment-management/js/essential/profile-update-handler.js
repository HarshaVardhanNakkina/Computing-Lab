$('#profile-details-form').submit(function(event) {
	event.preventDefault();

	let submitButton = $('#update-profile-btn');
	submitButton.prop('disabled', true);
	let url = $(this).attr('action');
	
	//{name: '', value: ''}
	let updatedProfile = $(this).serializeArray().reduce((acc, cur)=>{
		return {...acc,  [cur.name]: cur.value };
	},{});
	
	$.post(url,  updatedProfile , function(){}).done((data) => {
		console.log('profile updated', data);
		$('.update-success-fail').append(
			`
				<div class='alert alert-success alert-dismissible text-center fade show' role='alert'>
					Updated profile successfully.
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
});

// $('#profile-pic-input').on('change', function(event) {
//   console.log('HELL YEAH CHANGED');
//   console.log(event);
//   let filename = $(this).val().split('\\').pop();
//   console.log($(this).val());
// })

$('.custom-file-input').on('change', function() {
  let fileName = $(this).val().split('\\').pop();
  $(this).siblings('.custom-file-label').addClass('selected').html(fileName);
});

$('#commaddr').change(function(event) {
  $(this).text(event.target.value);
});

$('#copy-address').on('change', function() {
  let isChecked = $(this).is(':checked');
	if(isChecked) {
    let commaddr = $('#commaddr').text();
		$('#permaddr').text(commaddr);
	}else {
		$('#permaddr').text('');
	}
});