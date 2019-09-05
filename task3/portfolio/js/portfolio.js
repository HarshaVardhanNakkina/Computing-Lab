const logo = document.querySelectorAll('#logo > path');

console.log(logo);

logo.forEach(path => {
	console.log(path.getTotalLength());
});
