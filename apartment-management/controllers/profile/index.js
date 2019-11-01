const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const cryptoRandomString = require('crypto-random-string');
const path = require('path');

//* PROFILE PIC UPLOAD
const URI = 
process.env.DB_ENV === 'local' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI_CLOUD;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const connection = mongoose.createConnection(URI);
const { ensureAuthenticated } = require('../../auth/auth');

// Models
const UserDetails = require('../../models/UserDetails');
const User = require('../../models/User');

const router = express.Router();

// Get profile
router.get('/:id', ensureAuthenticated, (req, res, next) => {
	const { id: user_id } = req.params;
	
  UserDetails.findOne({_userId: user_id}).then((details) => {
    if(!details) {
      res.render('profile', { user_id })
    }else {
      res.render('profile', { ...details._doc, user_id });
    }
  }).catch(next);
});


// update profile
router.post('/update', ensureAuthenticated, (req, res, next) => {
  const { flatnum, name, fathername, mothername, occupation, commaddress, permaddress } = req.body;
  const { user_id } = req.query;

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
		let userDet = new Object({ _userId: ObjectId(user_id), flatnum, name, fathername, mothername, occupation, commaddress, permaddress });

		UserDetails.findOneAndUpdate({ _userId: user_id }, userDet, {new: true, upsert: true}).then((newDetails) => {
			// console.log(newDetails);
			User.findOneAndUpdate({_id: user_id}, {detailsGiven: true, firstTimeLogin: false}).then((updatedUser) => {
				req.flash('success_msg', 'profile is updated')
				req.flash('user_id', user_id);
				res.redirect(`/users/profile/${user_id}`);
			}).catch(next);
		}).catch(next);
  }
  
});

//* Upload, upate, delete profile pics...

let gfs;
connection.once('open', () => {
	gfs = Grid(connection.db, mongoose.mongo);
	gfs.collection('profilepics');
});

const storage = new GridFsStorage({
	url: URI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			const { user_id } = req.query;
			User.findOne({ _id: ObjectId(user_id) }).then((user) => {
				if(!user) reject(new Error({message: 'User does not exist'}));
				else {
					let randStr = cryptoRandomString({length: 16, type: 'url-safe'})
					const filename = randStr + path.extname(file.originalname);
					const fileInfo = {
						filename,
						bucketName: 'profilepics'
					}
					resolve(fileInfo);
				}
			}).catch(reject);
		});
	}
});

const upload = multer({ storage });

function deletePrevProfilePic(req, res, next){
	const { user_id } = req.query;
	console.log(req.query);
	UserDetails.findOne({_userId: user_id}).then((details) => {
		console.log(details);
		const { profilepicId } = details;
		if(profilepicId){
			gfs.remove({ _id: profilepicId, root: 'profilepics'}, (err, store) => {
				next();
			});
		}
	}).catch(next);
	next();
}

router.post('/upload', deletePrevProfilePic, upload.single('profilepic'), (req, res, next) => {
	// console.log("HELL YEAH UPLOAD");
	const { user_id } = req.query;
	const { file } = req;
	UserDetails.findOneAndUpdate(
			{ _userId: ObjectId(user_id) },
			{ profilepicId: ObjectId(file.id) },
			{ new:true, upsert: true }
		).then(newDetails => {
			req.flash('success_msg', 'profile pic is updated');
			res.redirect(`/users/profile/${user_id}`)
	}).catch(next);
});

router.get('/profilepic/:id', (req, res, next) => {
	// console.log("HELL YEAH PROFILE PIC");
	const { id } = req.params;
	gfs.files.findOne({ _id: ObjectId(id) }, (err, file) => {
		if (err) next(err);
		if(!file) res.send(null);
		else {
			const readStream = gfs.createReadStream(file.filename);
			readStream.pipe(res);
		}
	});
});

module.exports = router;
