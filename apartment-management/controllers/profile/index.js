const express							= require('express')
const mongoose						= require('mongoose')
const passport						= require('passport')
const ObjectId						= mongoose.Types.ObjectId
const multer							= require('multer')
const GridFsStorage				= require('multer-gridfs-storage')
const Grid 								= require('gridfs-stream')
const cryptoRandomString 	= require('crypto-random-string')
const path 								= require('path')

// Models
const UserDetails 				= require('../../models/UserDetails')
const User 								= require('../../models/User')
const router 							= express.Router()

//* PROFILE PIC UPLOAD
const URI = 
process.env.DB_ENV === 'local' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI_CLOUD;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const connection = mongoose.createConnection(URI);
const { ensureAuthenticated } = require('../../auth/auth');


// Get profile
// passport.authenticate('jwt', {session: false})
router.get('/', (req, res, next) => {
	console.log("GET PROFILE !!!!!!!!!");
	// const { _id: user_id } = req.user;

	res.render('profile',{
			profilepicId: '5dac0014c65e486064de203c',
			occupation: 'Credit Analyst',
			_id: '5da1bf41dd67a863836eaad7',
			_userId: '5da1be88c2fab26cb73f3381',
			__v: 0,
			commaddress: 'Nupur Bishnu Sood\r\n98, Chinchwad, Darjeeling - 226068',
			fathername: 'Bishnu Sood',
			flatnum: '98',
			mothername: 'Nupur Sood',
			name: 'Nupur Bishnu Sood',
			permaddress: 'Nupur Bishnu Sood\r\n98, Chinchwad, Darjeeling - 226068'
		})
	
  // UserDetails.findOne({_userId: user_id}).then((details) => {
  //   if(!details) {
	// 		res.status(401).json({message: 'Unauthorized access'})
	// 	}else {
  //     res.render('profile', {...details.toJSON()})
  //   }
  // }).catch(next);
});

// Edit profile
router.get('/edit', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id: user_id } = req.user;
	//user = {name: }
	User.findOne({_id: user_id}).then((user) => {
		if(!user) {
			res.render('profile_update')
		}
		UserDetails.findOne({_userId: user_id}).then((details) => {
			if(!details) {
				// res.status(401).json({message: 'Unauthorized access'})
				res.render('profile_update')
			}else {
				res.render('profile_update', {...details.toJSON()})
			}
		}).catch(next);
	})
})

// update profile
router.post('/update', passport.authenticate('jwt', {session: false}), (req, res, next) => {
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
				// req.flash('success_msg', 'profile is updated')
				// req.flash('user_id', user_id);
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
			const { _id: user_id } = req.user;
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
	console.log("YAY DELETING PREVIOUS PROFILE PIC")
	const { _id:user_id } = req.user
	UserDetails.findOne({_userId: user_id}).then((details) => {
		if(details) {
			const { profilepicId } = details;
			if(profilepicId){
				gfs.remove({ _id: profilepicId, root: 'profilepics'}, (err, store) => {
					console.log(err);
				});
			}
		}
	}).catch(next);
	next();
}

router.post('/profile-pic-upload', passport.authenticate('jwt', {session: false}), deletePrevProfilePic, (req, res, next) => {
	console.log("HELL YEAH UPLOAD");
	const { _id: user_id } = req.user;
	upload.single('profilepic')(req, res, function(err, file){
		if(err) throw err;
		let fileData;
		if(file) fileData = file
		else {
			fileData = req.file
		}
		UserDetails.findOneAndUpdate(
				{ _userId: ObjectId(user_id) },
				{ profilepicId: ObjectId(fileData.id) },
				{ new:true, upsert: true }
			).then(newDetails => {
				res.redirect(`/users/profile/edit`)
		}).catch(next);
	})
});

router.get('/profilepic', passport.authenticate('jwt', {session: false, parseReqBody: false}), (req, res, next) => {
	console.log("HELL YEAH PROFILE PIC");
	const { _id: user_id } = req.user;
	UserDetails.findOne({_userId: user_id}).then(userData => {
		console.log(userData);
		if(!userData) {
			res.sendFile('C:/Users/CSE/coding/Computing-Lab/apartment-management/static/img/abott@adorable.io.png')
		}
		const { profilepicId } = userData
		gfs.files.findOne({ _id: profilepicId }, (err, file) => {
			if (err) next(err);
			if(!file) {
				res.sendFile('C:/Users/CSE/coding/Computing-Lab/apartment-management/static/img/abott@adorable.io.png')
			}
			else {
				const readStream = gfs.createReadStream(file.filename);
				readStream.pipe(res);
			}
		});
	})
});

module.exports = router;
