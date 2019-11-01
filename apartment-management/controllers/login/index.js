const express		= require('express')
const router		= express.Router()
const passport	= require('passport')
const jwt				= require('jsonwebtoken')

// Login Page
function checkBeforeRendering(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.render('login');
}
router.get('/', checkBeforeRendering, (req, res) => {
  res.redirect('/');
});

// Login Handler
router.post('/', async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if(err || !user) {
				const error = new Error('An Error Occured')
				return next(error);
			}
			req.login(user, { session: false }, async (error) => {
				if(error) return next(error)
				
				const body = {_id: user._id, email: user.email}
				const token = jwt.sign({user: body}, 'hymn_for_the_weekend')
				return res.json({ token })
			})
		} catch (error) {
			return next(error)
		}
	})(req, res, next)
})
// router.post('/', passport.authenticate('local', {
//     failureRedirect: '/users/login',
//     failureFlash: true
//   }),
//   function(req, res, next) {
//     // res.render('profile', { user: req.user });
//     const { user } = req;
//     if (user.detailsGiven) res.redirect('/');
//     else res.redirect(`/users/profile/${user._id}`);
//   }
// );

module.exports = router;
