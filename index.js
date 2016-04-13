(function() {
  'use strict';

  var path = require('path');
  var express = require('express');
  var app = express();

  const DIST_PATH = path.join(__dirname, 'dist');
  const SITE_PATH = path.join(__dirname, 'site');
  app.use('/javascript', express.static(path.join(DIST_PATH, 'javascript')));
  app.use('/css', express.static(path.join(DIST_PATH, 'css')));
  app.use('/directives', express.static(path.join(SITE_PATH, 'directives')));
  app.use('/templates', express.static(path.join(SITE_PATH, 'templates')));

  app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'site', 'index.html'));
  });

  module.exports = app;
})();
