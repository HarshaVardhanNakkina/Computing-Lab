const express = require('express');
const compression= require('compression');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Passport config
require('./auth/passport')(passport);

const app = express();

// connect to mongoose
const URI =
  process.env.DB_ENV === 'local'
    ? process.env.MONGO_URI_LOCAL
		: process.env.MONGO_URI_CLOUD;

mongoose
  .connect(URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then((db) => {
    console.log('MongoDB is up')
  })
  .catch(console.log);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Compression for reduced response size
app.use(compression());

// Bodyparser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Express Session middleware
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// Static files css, js etc...
app.use(express.static('static', { maxAge: 31557600 }));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 2020;

app.listen(PORT, console.log(`server started on ${PORT}`));
