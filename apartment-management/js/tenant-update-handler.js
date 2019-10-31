$('tenant-details-from').submit(function(event){
	event.preventDefault();
	let submitButton = $('update-tenant-btn');
	submitButton.prop('disabled', true);
	let url = $(this).attr('action');
	let updatedTenant = $(this).serializeArray().reduce((acc,cur)=>{
		return {...acc, [cur.name]: cur.value };
	},{});
})