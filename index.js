(function() {
  'use strict';

  var express = require('express');
  var api = require('api');
  var website = require('website');

  var app = express();
  api.init(app);
  website.init(app);

  app.listen(80, function() {
    console.log('App listening on port 80.');
  });
})();
