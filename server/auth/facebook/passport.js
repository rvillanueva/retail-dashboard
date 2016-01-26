var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log('creating new user')
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json,
            settings: {
              fbtoken: accessToken
            }
          });
          console.log(user)
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          if (!user.settings){
            user.settings = {}
          }
          user.settings.fbtoken = accessToken;
          user.facebook = profile._json;
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        }
      })
    }
  ));
};