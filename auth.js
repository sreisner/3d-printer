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
      app.db.User.findOne({ facebookId: profile.id }, function(err, user) {
        if (err) {
          console.error(err);
          return done(err);
        }
        done(null, user);
      });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { successRedirect: '/',
                                          failureRedirect: '/login' }));
  }

  module.exports = {
    initializeFacebookAuth: initializeFacebookAuth
  }

})();
