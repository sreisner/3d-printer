(function() {
  'use strict';

  var api = require('./index');
  var express = require('express');
  var app = express();

  api.addApiHooks(app, 'mongodb://localhost/printer');

  app.listen(5000, function() {
    console.log('API running on port 5000');
  });
})();
