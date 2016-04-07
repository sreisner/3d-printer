(function() {
  'use strict';

  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;

  const FACEBOOK_APP_ID = '1584371691878803';
  const FACEBOOK_APP_SECRET = '4b0d6570adcb80614c65df293f028767';

  function initializeFacebookAuth(app) {
    passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      app.db.models.User.findOne({ facebookId: profile.id }, function(err, user) {
        if (err) {
          var user = app.db.models.User.insert({
            facebookId: profile.id,
            name: profile.displayName,
            userSince: new Date()
          });
          return done(null, user);
        }
        done(null, user);
      });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { successRedirect: 'http://ec2-52-207-246-149.compute-1.amazonaws.com/',
                                          failureRedirect: 'http://ec2-52-207-246-149.compute-1.amazonaws.com/' }));
  }

  module.exports = {
    initializeFacebookAuth: initializeFacebookAuth
  }

})();
