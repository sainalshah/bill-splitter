var User = require('../models/user');
var Config = require('../models/config');
var LocalStrategy = require('passport-local').Strategy;

var configStore = require('./config')
var keys = require('./keys.json')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-signin', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'id',
    passwordField: 'token',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, function (req, id, fb_access_token, done) {

    // // Use this to see the information returned from Facebook
    // console.log(profile)

    process.nextTick(function () {
      profile = req
      User.findOne({ 'fb.id': profile.id }).lean().exec(function (err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {
          User.findOne(function (err, randomUser) {
            if (err)
              throw err;
            userType = "user";
            //determine atleast one user exists
            if (randomUser == null) {
              userType = "admin";
              newConfig = { name: "cutoffDate", value: configStore.getCutoffDate().toString(), type: "date" };
              Config.create(newConfig, function (err, res) {
                if (err)
                  throw err;
              });
            }
            console.log("new profile received", user)
            var newUser = new User();
            newUser.fb.id = profile.id;
            newUser.fb.access_token = fb_access_token;
            newUser.fb.name = profile.name;
            newUser.fb.email = profile.email;
            newUser.baseRent = configStore.baseRent;
            newUser.userType = userType;
            newUser.save(function (err) {
              if (err)
                throw err;

              return done(null, newUser.toJSON());
            });
          })

        }

      });
    });
  }));

}