(function() {
    'use strict';
    var morgan = require('morgan');
    var express = require('express');
    var bodyParser = require('body-parser');
    var path = require('path');
    var cors = require('cors');

    var routes = require('./routes');
    var db = require('./db');
    var auth = require('./auth');

    function addApiHooks(app, mongodb_url) {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors());
	app.db = db.connect(mongodb_url);
	routes.initializeRoutes(app);
	auth.initializeFacebookAuth(app);
    }

    module.exports = addApiHooks;
})();
