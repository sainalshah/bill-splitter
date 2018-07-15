var User = require('../models/user');
var Config = require('../models/config');
var FacebookStrategy = require('passport-facebook').Strategy;

var config = require('./config.json')
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

  passport.use('facebook', new FacebookStrategy({
    clientID: keys.FACEBOOK_API_KEY,
    clientSecret: keys.FACEBOOK_API_SECRET,
    callbackURL: 'http://192.168.1.106:3000/auth/facebook/callback',
    enableProof: true,
    profileFields: ['name', 'emails']
  }, function (access_token, refresh_token, profile, done) {

    // // Use this to see the information returned from Facebook
    // console.log(profile)

    process.nextTick(function () {

      User.findOne({ 'fb.id': profile.id }, function (err, user) {
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
              configArray = [{name:"Permanent cutoff date", value:"10", type:"text"},{name:"Temporary cutoff date", value:"", type:"date"}]
              Config.create(configArray, function (err, res) {
                if (err)
                  throw err;
              })
            }
            console.log("profile received", user)
            var newUser = new User();
            newUser.fb.id = profile.id;
            newUser.fb.access_token = access_token;
            newUser.fb.firstName = profile.name.givenName;
            newUser.fb.lastName = profile.name.familyName;
            newUser.fb.email = profile.emails[0].value;
            newUser.baseRent = config.baseRent;
            newUser.userType = userType;
            newUser.save(function (err) {
              if (err)
                throw err;

              return done(null, newUser);
            });
          })

        }

      });
    });
  }));

}