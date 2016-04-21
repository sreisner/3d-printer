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
      callbackURL: '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      var userModel = app.db.models.User;
      userModel.findOne({facebookId: profile.id}, function(err, user) {
        if (err) {
          user = app.db.models.User.insert({
            facebookId: profile.id,
            name: profile.displayName,
            userSince: new Date()
          });
        }
        done(null, user);
      });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {successRedirect: '/',
                                         failureRedirect: '/'}));
  }

  module.exports = {
    initializeFacebookAuth: initializeFacebookAuth
  };
})();
