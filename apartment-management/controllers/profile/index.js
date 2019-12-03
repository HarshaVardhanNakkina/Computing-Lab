const express							= require('express')
const mongoose						= require('mongoose')
const passport						= require('passport')
const ObjectId						= mongoose.Types.ObjectId
const multer							= require('multer')
const GridFsStorage				= require('multer-gridfs-storage')
const Grid 								= require('gridfs-stream')
const cryptoRandomString 	= require('crypto-random-string')
const path 								= require('path')
var mongoXlsx = require('mongo-xlsx');
// Models
const UserDetails 				= require('../../models/UserDetails')
const User 								= require('../../models/User')
const router 							= express.Router()
const Complaints  = require('../../models/SecretaryDetails/complaint')
const Dues  = require('../../models/SecretaryDetails/Dues')
const Employees = require('../../models/SecretaryDetails/employees')
const Notice = require('../../models/SecretaryDetails/Notice')
const Letters = require('../../models/SecretaryDetails/Letters')

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
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	// console.log("GET PROFILE !!!!!!!!!");
	const { _id: user_id } = req.user;
	
  UserDetails.findOne({_userId: user_id}).then((details) => {
	if(!details) {
		res.status(401).json({message: 'Unauthorized access'})
	}else {
  	//res.render('profile', {...details.toJSON()})
	
	User.findOne({_id : user_id}).then((det)=>{
		const role = det.role;
		if(role === "1"){
			res.status(200).redirect('/users/president');
		}
		else if(role === "2"){
			res.status(200).render('secretary');
		}
		else if(role === "3"){
			res.status(200).redirect('/users/treasurer');
		}
		else if(role==="4") {
			res.status(200).render('office');
		}
		else{
			const { _id: user_id } = det
			UserDetails.findOne({_userId: user_id}).then(details => {
				console.log(details)
				res.status(200).render('profile',{...details.toJSON()});
			})
		}
	})
	.catch(err=>{
		console.log(err)
	})
	}
  }).catch(next);
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
				console.log(details)
				// res.status(401).json({message: 'Unauthorized access'})
				res.render('profile_update')
			}else {
				res.render('profile_update', {...details.toJSON()})
			}
		}).catch(next);
	})
})


router.get('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const name = req.params.id;
		UserDetails.findOne({ name: name}).then((details) => {
			if(!details) {
				res.render('profile_update')
			}else {
				res.render('profile_update', {...details.toJSON()})
			}
		}).catch(next);
})


// update profile
router.post('/update', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const { flatnum, name, fathername, mothername, occupation, commaddress, permaddress } = req.body;
  const { _id: user_id } = req.user;

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
    res.status(422).render('profile_update', 
      {errors, ...req.body}
    );
  }else {
		let userDet = { _userId: ObjectId(user_id), flatnum, name, fathername, mothername, occupation, commaddress, permaddress };

		UserDetails.find({_userId: user_id}).then((user) => {
			if(!user) {
				let newUser = new UserDetails(userDet)
				newUser.save().then((savedUser) => {
					res.status(200).json({message: 'profile update is successful'});
				}).catch(next)
			}else {
				UserDetails.findOneAndUpdate({ _userId: user_id }, userDet, {new: true, upsert: true}).then((newDetails) => {
					// console.log(newDetails);
					User.findOneAndUpdate({_id: user_id}, {detailsGiven: true, firstTimeLogin: false}).then((updatedUser) => {
						// req.flash('success_msg', 'profile is updated')
						// req.flash('user_id', user_id);
						res.status(200).json({message: 'profile update is successful'});
					}).catch(next);
				}).catch(next);
			}
		})

  }
  
});

router.use('/create-complaint', require('./complaints.js'))

//TODO: Upload, upate, delete profile pics...
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
	// console.log("YAY DELETING PREVIOUS PROFILE PIC")
	const { _id:user_id } = req.user
	UserDetails.findOne({_userId: user_id}).then((details) => {
		if(details && details !== undefined) {
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
	// console.log("HELL YEAH UPLOAD");
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

function deletePrevProof(req, res, next) {
	const { _id:user_id } = req.user
	UserDetails.findOne({_userId: user_id}).then((details) => {
		// console.log(details)
		if(details && details !== undefined) {
			const { addressProofId } = details;
			if(addressProofId){
				gfs.remove({ _id: addressProofId, root: 'profilepics'}, (err, store) => {
					console.log(err);
				});
			}
		}
	}).catch(next);
	next();
}

function deletePrevSaleProof(req, res, next) {
	const { _id:user_id } = req.user
	UserDetails.findOne({_userId: user_id}).then((details) => {
		// console.log(details)
		if(details && details !== undefined) {
			const { saleProofId } = details;
			if(saleProofId){
				gfs.remove({ _id: saleProofId, root: 'profilepics'}, (err, store) => {
					console.log(err);
				});
			}
		}
	}).catch(next);
	next();
}

router.post('/address-proof-upload', passport.authenticate('jwt', {session: false}), deletePrevProof, (req, res, next) => {
	// console.log("HELL YEAH UPLOAD");
	const { _id: user_id } = req.user;
	upload.single('addressproof')(req, res, function(err, file){
		if(err) console.log(err)
		let fileData;
		if(file) fileData = file
		else {
			fileData = req.file
		}
		UserDetails.findOneAndUpdate(
				{ _userId: ObjectId(user_id) },
				{ addressProofId: ObjectId(fileData.id) },
				{ new:true, upsert: true }
			).then(newDetails => {
				res.redirect(`/users/profile/edit`)
		}).catch(next);
	})
});

router.post('/sale-proof-upload', passport.authenticate('jwt', {session: false}), deletePrevSaleProof, (req, res, next) => {
	// console.log("HELL YEAH UPLOAD");
	const { _id: user_id } = req.user;
	upload.single('saleproof')(req, res, function(err, file){
		if(err) console.log(err)
		let fileData;
		if(file) fileData = file
		else {
			fileData = req.file
		}
		UserDetails.findOneAndUpdate(
				{ _userId: ObjectId(user_id) },
				{ saleProofId: ObjectId(fileData.id) },
				{ new:true, upsert: true }
			).then(newDetails => {
				res.redirect(`/users/profile/edit`)
		}).catch(next);
	})
});

router.get('/profilepic', passport.authenticate('jwt', {session: false, parseReqBody: false}), (req, res, next) => {
	// console.log("HELL YEAH PROFILE PIC");
	const { _id: user_id } = req.user;
	UserDetails.findOne({_userId: user_id}).then(userData => {
		// console.log(userData);
		if(!userData) {
			res.sendFile('/img/palceholder.png', {root: 'static'})
		}
		const { profilepicId } = userData
		gfs.files.findOne({ _id: profilepicId }, (err, file) => {
			if (err) next(err);
			if(!file) {
				res.sendFile('/img/palceholder.png', {root: 'static'})
			}
			else {
				const readStream = gfs.createReadStream(file.filename);
				readStream.pipe(res);
			}
		});
	})
});

router.get('/addressproof', passport.authenticate('jwt', {session: false, parseReqBody: false}), (req, res, next) => {
	// console.log("HELL YEAH PROFILE PIC");
	const { _id: user_id } = req.user;
	UserDetails.findOne({_userId: user_id}).then(userData => {
		// console.log(userData);
		if(!userData) {
			res.sendFile('/img/palceholder.png', {root: 'static'})
		}
		const { addressProofId } = userData
		gfs.files.findOne({ _id: addressProofId }, (err, file) => {
			if (err) next(err);
			if(!file) {
				res.sendFile('/img/palceholder.png', {root: 'static'})
			}
			else {
				const readStream = gfs.createReadStream(file.filename);
				readStream.pipe(res);
			}
		});
	}).catch(next)
});

router.get('/saleproof', passport.authenticate('jwt', {session: false, parseReqBody: false}), (req, res, next) => {
	// console.log("HELL YEAH PROFILE PIC");
	const { _id: user_id } = req.user;
	UserDetails.findOne({_userId: user_id}).then(userData => {
		// console.log(userData);
		if(!userData) {
			res.sendFile('/img/palceholder.png', {root: 'static'})
		}
		const { saleProofId } = userData
		gfs.files.findOne({ _id: saleProofId }, (err, file) => {
			if (err) next(err);
			if(!file) {
				res.sendFile('/img/palceholder.png', {root: 'static'})
			}
			else {
				const readStream = gfs.createReadStream(file.filename);
				readStream.pipe(res);
			}
		});
	})
});

router.get('/profilepic/:user_id', passport.authenticate('jwt', {session: false, parseReqBody: false}), (req, res, next) => {
	const { user_id } = req.params;
	UserDetails.findOne({_userId: ObjectId(user_id)}).then(userData => {
		if(!userData) {
			res.sendFile('/img/palceholder.png', {root: 'static'})
		}
		const { profilepicId } = userData
		gfs.files.findOne({ _id: ObjectId(profilepicId) }, (err, file) => {
			if (err) next(err);
			if(!file) {
				res.sendFile('/img/palceholder.png', {root: 'static'})
			}
			else {
				const readStream = gfs.createReadStream(file.filename);
				readStream.pipe(res);
			}
		});
	})
});

router.get('/addressproof/:user_id', passport.authenticate('jwt', {session: false, parseReqBody: false}), (req, res, next) => {
	const { user_id } = req.params;
	UserDetails.findOne({_userId: ObjectId(user_id)}).then(userData => {
		if(!userData) {
			res.sendFile('/img/palceholder.png', {root: 'static'})
		}
		const { addressProofId } = userData
		gfs.files.findOne({ _id: ObjectId(addressProofId) }, (err, file) => {
			if (err) next(err);
			if(!file) {
				res.sendFile('/img/palceholder.png', {root: 'static'})
			}
			else {
				const readStream = gfs.createReadStream(file.filename);
				readStream.pipe(res);
			}
		});
	})
});

router.get('/saleproof/:user_id', passport.authenticate('jwt', {session: false, parseReqBody: false}), (req, res, next) => {
	const { user_id } = req.params;
	UserDetails.findOne({_userId: ObjectId(user_id)}).then(userData => {
		if(!userData) {
			res.sendFile('/img/palceholder.png', {root: 'static'})
		}
		const { saleProofId } = userData
		gfs.files.findOne({ _id: ObjectId(saleProofId) }, (err, file) => {
			if (err) next(err);
			if(!file) {
				res.sendFile('/img/palceholder.png', {root: 'static'})
			}
			else {
				const readStream = gfs.createReadStream(file.filename);
				readStream.pipe(res);
			}
		});
	})
});


router.get('/viewowners',passport.authenticate('jwt', {session: false, parseReqBody: false}) ,(req, res,next) => {
		
		console.log("In viewOwners route");
		const id = [] ;
		var i =0;
		var flat_owners =[];
		// var flat_owners_details =[];
		let details = {};
		User.find({role: "5"}).then((owners) => {
			flat_owners = owners.map(owner => {
				const { _id: user_id } = owner;
				return UserDetails.findOne({_userId: user_id})
			})

			Promise.all(flat_owners).then((details) => {
				let flat_owners_details = details.reduce((acc, cur) => {
					if(cur){
						const {name, flatnum, _userId} = cur;
						return [...acc, {name, flatnum, _userId}]
					}else return acc
				},[])
				
				//flat_owners_details = details;
				console.log(JSON.stringify(flat_owners_details));
				res.status(200).render('flatowners',{ owners : flat_owners_details })
			}).catch(next)
			
		}).catch(next)
		// User.find({ role : "5"}).then((owners)=>{
		// 	console.log("OWNERS")
			
		// 	owners.forEach((records)=>{
		// 		id[i] = records._id;
		// 		console.log(id[i]);
		// 		i = i +1;
		// 	})
		// 	i=0;
		// 	//console.log(ObjectID(id))
		// 	owners.forEach((rec)=>{

		// 	//console.log("In Ownerdetails query")

		// 	UserDetails.findOne({ _userId : rec._id})
		// 	.then(ownerdetails =>{
		// 		console.log(ownerdetails)
		// 			details.name = ownerdetails.name;
		// 			details.flatno = ownerdetails.flatnum ;
		// 			flat_owners.push(details);
		// 			 console.log(flat_owners[i]);
					
		// 			i =i +1;
		// 	})
		// 	.catch(err =>{
		// 		console.log(err);
		// 	})
		// })

		// })
		// .catch(error =>{
		// 	console.log(error);
		// })

		

	

		
		// console.log(JSON.stringify(flat_owners));

		
		// res.status(200).render('flatowners',{ owners : flat_owners })
});


// Update Owner Details from Secretary page 

router.post(
  "/viewowners/update/ok",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const {
      flatnum,
      name,
      fathername,
      mothername,
      occupation,
      commaddress,
      permaddress
    } = req.body;
    const doc = {};
    const {profilename, id} = req.query;
    console.log("/viewowners/update/:updateid/ok");
    UserDetails.findOne({ _userId: id }).then(details => {
      if (!details) {
        res.status(400).json({ msg: " User Not found" });
      } else {

        const { _id: user_id } = details._userId;

        let errors = [];
        if (!escape(flatnum.trim()).length)
          errors.push({ msg: "invalid falt number" });
        if (!escape(name.trim()).length) errors.push({ msg: "invalid name" });
        if (!escape(fathername.trim()).length)
          errors.push({ msg: "invalid father name" });
        if (!escape(mothername.trim()).length)
          errors.push({ msg: "invalid mother name" });
        if (!escape(commaddress.trim()).length)
          errors.push({ msg: "invalid communication address" });
        if (!escape(permaddress.trim()).length)
          errors.push({ msg: "invalid permenant address" });

        if (errors.length) {
          res.status(422).render("profile_update", { errors, ...req.body });
        } else {
          let userDet = new Object({
            _userId: ObjectId(user_id),
            flatnum,
            name,
            fathername,
            mothername,
            occupation,
            commaddress,
            permaddress
          });

          UserDetails.findOneAndUpdate({ _userId: user_id }, userDet, {
            new: true,
            upsert: true
          })
            .then(newDetails => {
              // console.log(newDetails);
              User.findOneAndUpdate(
                { _id: user_id },
                { detailsGiven: true, firstTimeLogin: false }
              )
                .then(updatedUser => {
                  // req.flash('success_msg', 'profile is updated')
                  // req.flash('user_id', user_id);
                  res
                    .status(200)
                    .render('secretary');
                })
                .catch(next);
            })
            .catch(next);
        }
      }
    });
  }
);
  


  // Updating Flat owners from secretary page
  router.get('/viewowners/view/:viewid',passport.authenticate('jwt',{session:false}), (req, res ) => {
		const id = req.params.viewid;
		console.log(id);

  }); 
  router.get('/viewowners/update/',passport.authenticate('jwt',{session:false}), (req, res) => {
		const { id, name }  = req.query;
		console.log(id)
		const docs={};
		res.render('update_owner',{_userId: id, name});
	
});


  router.get('/viewowners/delete/:deleteid', passport.authenticate('jwt',{session : false}), (req, res) => {
		const id = req.params.deleteid;
		console.log(id)

			UserDetails.findOne({ name : id})
			.then(user =>{
				if(!user){
					res.status(400).json({ msg :"User Not found"});
				}
				else{

					
					User.findOne({ _id : user._userId})
					.then( found =>{
							if(!found){
								return res.status(400).json({ msg : "User is not in User list"})
							}
							else{
								User.deleteOne({found})
								.then( suc =>{
									console.log("Deleted from Users successfully");
								})
								.catch( err =>{
									console.log(err)
								})
							}
					})
					.catch(err =>{
						return res.status(400).json({ msg : err});
					})


					UserDetails.deleteOne({ name : id})
					.then(details =>{
						return res.status(200).json({ msg : "Deleted from Userdetails successfully"});
					})
					.catch( err =>{
						return res.status(400).json({ msg : err})
					})


				}
			})
			
			
		

  });

  // Add Complaints
  router.get('/complaints', passport.authenticate('jwt',{session:false}),(req, res) => {
		res.render('create_complaint');
  });

  router.get('/viewcomplaints', passport.authenticate('jwt',{session: false}),(req, res , next) => {
	var complaints =[];

	Complaints.find()
	.then( com =>{
		console.log(com)

		com.map( comp =>{
			complaints.push(comp);
		})

		console.log(complaints);
		//const comp = JSON.stringify(complaints);
		res.render('complaints',{ comp_list : complaints});

	})
	.catch(next)
	
  });	

  router.post('/viewcomplaints/change',passport.authenticate('jwt',{session: false}), (req,res)=>{
	  	console.log("In the change status route")
		const comagainst = req.body.against;
		console.log(comagainst);

		Complaints.findOne({ against : comagainst})
		.then( profile =>{
			console.log("Found complaint"+profile.approved)
			if(profile.approved === "Not Approved" || profile.approved === "Not approved" ){
				Complaints.findOneAndUpdate({ against : comagainst},{ $set :{approved : "Approved"}},{new : true})
				.then( pro =>{
					console.log(pro)
					
				})
				.catch( err =>{
					console.log(err)
				})
			}
			else{
				Complaints.findOneAndUpdate({ against : comagainst},{ $set :{approved : "Not Approved"}},{new : true})
				.then( pro =>{
					console.log(pro);
					
				})
				.catch( err =>{
					console.log(err);
				})
			}
			return res.render('secretary');
			
			
		})
		.catch(err =>{
			console.log(err)
		})


		

  })

  router.post('/addcomplaints', passport.authenticate('jwt',{session:false}),(req, res) => {
		const det = {};
		det.against =req.body.against;
		det.cause = req.body.cause;
		console.log(det)

		const newcom = new Complaints(det);

		newcom.save()
		.then( com =>{
			console.log(com);
		})
		.catch(err =>{
			console.log(err);
		})
		res.render('complaints');


  });

  router.get('/viewdues',passport.authenticate('jwt',{session : false}), (req,res,next)=>{
	  const dues =[];
	  Dues.find()
	  .then( due =>{
			console.log(due);

			due.map(docs =>{
				dues.push(docs);
			})
			console.log("Using map function "+ dues);

			
			console.log(JSON.stringify(dues))

			res.status(200).render('Dues',{ due_list : dues})
			//console.log(due_details)
	  })
	  .catch(next)

	 
  })

  //Creating Notices

  router.get('/createnotice', passport.authenticate('jwt',{session: false}) , (req,res)=>{
	  res.render('Notice');
  })

  router.post('/createnotice/added',passport.authenticate('jwt',{session: false}) ,(req, res) => {
		const noticedet ={};
		noticedet.refno = Math.floor(Math.random() * 100000);
		noticedet.date = Date.now() ;
		noticedet.from = req.body.from;
		noticedet.to = req.body.to;
		noticedet.title = req.body.title;
		noticedet.msg = req.body.msg;

		console.log(noticedet);

		const notice = new Notice(noticedet);

		notice.save()
		.then( details =>{
			console.log(details);
			det = JSON.stringify(details);
			var model = mongoXlsx.buildDynamicModel(det);
 
			/* Generate Excel */
			mongoXlsx.mongoData2Xlsx(det, model, function(err, data) {
		  		console.log('File saved at:', data.fullPath); 
			});

			
	
 
	
			

		})
		.catch( err =>{
			console.log(err);
		})
  });

 router.post('/dues/adddue', passport.authenticate('jwt',{session: false}),(req, res) => {
		const duedet ={}
		duedet.amount = req.body.amount;
		duedet.duemonth = req.body.duemonth ;
		duedet.duename = req.body.duename ;

		const det = new Dues(duedet);
		det.save()
		.then( dues =>{
			console.log(dues)
		})
		.catch( err=>{
			console.log(err)
		})
 });

 router.get('/dues', passport.authenticate('jwt',{session : false}), (req,res)=>{
	 res.render('regdue');
 })

 router.get('/viewemployee', passport.authenticate('jwt',{session : false}), (req,res,next)=>{
	const dues =[];
	Employees.find()
	.then( due =>{
		  console.log(due);

		  due.map(docs =>{
			  dues.push(docs);
		  })
		  console.log("Using map function "+ dues);

		  
		  console.log(JSON.stringify(dues))
		  res.status(200).render('Employee',{ emp_list : dues})

		  //console.log(due_details)
	})
	.catch(err =>{
		console.log(err)
	})


 })

 router.get('/addemp',passport.authenticate('jwt',{ session : false}), (req, res) => {
		res.render('create_employee');
 });
 router.post('/addemployee', passport.authenticate('jwt',{session:false}),(req, res , next) => {
	const det = {};
	det.name =req.body.name;
	det.occupation = req.body.duty;
	det.Dutytime = req.body.dutytime;
	det.shift = req.body.shift;
	det.Datefrom = req.body.datefrom ;
	det.Dateto = req.body.dateto;
	console.log(det)

	const newcom = new Employees(det);

	newcom.save()
	.then( com =>{
		console.log(com);
		return res.render('secretary');

	})
	.catch(err =>{
		console.log(err)
	})

	


});

module.exports = router;
