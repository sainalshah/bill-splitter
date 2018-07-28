var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require("cookie-parser");

var billsRouter = require('./routes/bills');
var rentRouter = require('./routes/rent');
var Verify = require('./config/verify');

var cors = require("cors");


//options for cors midddleware
options = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http://localhost:4200",
  preflightContinue: false
};

//use cors middleware
app.use(cors(options));
app.options("*", cors(options));
// Mongoose Setup
mongoose.connect('mongodb://localhost:27017/bsp');

// Middleware
app.use(cookieParser());
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Setting up the Passport Strategies
require("./config/passport")(passport)

// -> Facebook

// <- Facebook
// app.post('/auth/login', passport.authenticate('local-sigin', {
//   successRedirect : '/profile', // redirect to the secure profile section
//   failureRedirect : '/signup', // redirect back to the signup page if there is an error
//   failureFlash : true // allow flash messages
// }));
app.post('/auth/login', function (req, res, next) {
  console.log('inside post /auth/');
  passport.authenticate('local-signin', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        throw err;
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      res.locals.currentIP = req.ip;
      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

// Logout
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/")
})

// Home page

rentRouter
app.use('/bills', billsRouter);
app.use('/rent', rentRouter);
app.get('/', function (req, res) {

  res.render('layout', { user: req.user });
});

app.listen(3000);
