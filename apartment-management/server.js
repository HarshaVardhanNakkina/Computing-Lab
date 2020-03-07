const express = require('express')
const compression = require('compression')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
// const flash = require('connect-flash')
// const session = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')

// Passport config
require('./auth/passport')(passport)

const app = express()

// clever cloud variable
/*

MONGODB_ADDON_HOST='b5f1vd9rknve9ty-mongodb.services.clever-cloud.com'
MONGODB_ADDON_DB='b5f1vd9rknve9ty'
MONGODB_ADDON_USER='ufhkrll0zvfqivtdaddx'
MONGODB_ADDON_PORT='27017'
MONGODB_ADDON_PASSWORD='R6nalXNULMtCMIwnDOzR'
MONGODB_ADDON_URI='mongodb://ufhkrll0zvfqivtdaddx:R6nalXNULMtCMIwnDOzR@b5f1vd9rknve9ty-mongodb.services.clever-cloud.com:27017/b5f1vd9rknve9ty'

*/
// const cc = {
// 	host: process.env.MONGODB_ADDON_HOST,
// 	db: process.env.MONGODB_ADDON_DB,
// 	user: process.env.MONGODB_ADDON_USER,
// 	port : process.env.MONGODB_ADDON_POR,
// 	password: process.env.MONGODB_ADDON_PASSWORD
// }

// const URI_CC = `mongodb://${cc.user}:${cc.password}@${cc.host}:${cc.port}/${cc.db}`

// connect to mongoose
const URI =
  process.env.DB_ENV === 'local'
    ? process.env.MONGO_URI_LOCAL
    : process.env.MONGO_URI_CLOUD

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB is up')
  })
  .catch(console.log)

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Compression for reduced response size
app.use(compression())

// Bodyparser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// cookie parser
app.use(cookieParser())

// Express Session middleware
// app.use(
// 	session({
// 		secret: 'secret',
// 		resave: true,
// 		saveUninitialized: true
// 	})
// );

// Connect flash
// app.use(flash());

// Global Variables
// app.use((req, res, next) => {
// 	res.locals.success_msg = req.flash('success_msg');
// 	res.locals.error_msg = req.flash('error_msg');
// 	res.locals.error = req.flash('error');
// 	next();
// });

// Static files css, js etc...
app.use(express.static('static', { cacheControl: true, maxAge: 31536000 }))

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 2020

app.listen(PORT, console.log(`server started on ${PORT}`))
