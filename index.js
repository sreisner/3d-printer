(function() {
  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var path = require('path');
  var cors = require('cors');

  var routes = require('./routes');
  var db = require('./db');
  var auth = require('./auth');

  var app = express();

  const DIST_PATH = path.join(__dirname, 'dist');
  const SITE_PATH = path.join(__dirname, 'site');

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cors());
  app.db = db.connect('mongodb://localhost/printer');
  routes.initializeRoutes(app);
  auth.initializeFacebookAuth(app);

  app.use('/javascript', express.static(path.join(DIST_PATH, 'javascript')));
  app.use('/css', express.static(path.join(DIST_PATH, 'css')));
  app.use('/directives', express.static(path.join(SITE_PATH, 'directives')));
  app.use('/templates', express.static(path.join(SITE_PATH, 'templates')));

  app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'site', 'index.html'));
  });

  module.exports = app;
})();
