const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../auth/auth');
const { check, validationResult } = require('express-validator');
const UserDetails = require('../../models/UserDetails');
const ObjectId = require('mongoose').Types.ObjectId;

// Get profile
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  const { id: user_id } = req.params;
  UserDetails.findOne({_userId: user_id}).then((details) => {
    console.log({ ...details._doc });
    if(!details) {
      res.render('profile', user_id)
    }else {
      res.render('profile', { ...details._doc, user_id });
    }
  }).catch(next);
});


// update profile
function validateDetails() {
  return [
    check('flatnum').trim().escape().not().isEmpty(),
    check('name').trim().escape().not().isEmpty(),
    check('fathername').trim().escape().not().isEmpty(),
    check('mothename').trim().escape().not().isEmpty(),
    check('occupation').trim().escape().not().isEmpty(),
    check('commaddress').trim().escape().not().isEmpty(),
    check('permaddress').trim().escape().not().isEmpty(),
  ];
}
router.post('/update', ensureAuthenticated, (req, res, next) => {
  const { flatnum, name, fathername, mothername, occupation, commaddress, permaddress } = req.body;
  const { user_id } = req.query;
  // const errors = validationResult(req);

  let errors = [];
  if(!escape(flatnum.trim()).length)
    errors.push({msg: 'invalid falt number'});
  if (!escape(name.trim()).length)
    errors.push({ msg: 'invalid name' });
  if (!escape(fathername.trim()).length)
    errors.push({ msg: 'invalid father name' });
  if (!escape(mothername.trim()).length)
    errors.push({ msg: 'invalid mother name' });
  if (!escape(commaddress.trim()).length)
    errors.push({ msg: 'invalid communication address' });
  if (!escape(permaddress.trim()).length)
    errors.push({ msg: 'invalid permenant address' });


  if(errors.length) {
    res.status(422).render('profile', 
      {errors, ...req.body}
    );
  }else {
    let userDet = new Object({ _userId: user_id, flatnum, name, fathername, mothername, occupation, commaddress, permaddress });
    userDet._userId = ObjectId(user_id);
    UserDetails.update({ _userId: user_id }, userDet, {new:true, upsert: true}, (err, details) => {
      // req.flash('success_msg', 'profile is updated');
      // res.redirect(`/users/profile/${user_id}`);
      console.log({...details});
      res.render('profile', {
        success_msg: 'profile is updated',
        ...details._doc
      });
    }).catch(next);
  }
  
});

module.exports = router;
