module.exports = function generateOTP() {
	let digits = '0123456789';
	let otplen = 6;
	let otp = '';
	for (let i = 0; i < otplen; i++) {
		otp = otp + digits[Math.floor(Math.random() * 10)];		
	}
	return otp;
};
