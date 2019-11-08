$('#logout-btn').mouseup(function(event){
	event.preventDefault();
	console.log("USER WANTS TO LOGOUT");
	// document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
	document.cookie = 'jwt_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
	window.location.replace(window.location.origin)
})