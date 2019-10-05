module.exports = function invalidSoRedirect(req, res, msg, redirUrl) {
	req.flash('error_msg', msg);
	res.redirect(redirUrl);
}