$( document ).ready(function() {
	let cookieExists = document.cookie;
	if(cookieExists) {
		$('.not-logged-in').hide();
	}else {
		$('.logged-in').hide();
	}
})