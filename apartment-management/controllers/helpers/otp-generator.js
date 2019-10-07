module.exports = function generateOTP(len=6) {
	let digits = '0123456789';
	let otplen = len;
	let otp = '';
	for (let i = 0; i < otplen; i++) {
		otp = otp + digits[Math.floor(Math.random() * 10)];		
	}
	return otp;
};
