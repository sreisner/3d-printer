(function() {
    'use strict';
    var morgan = require('morgan');
    var express = require('express');
    var bodyParser = require('body-parser');
    var path = require('path');
    var cors = require('cors');
    var app = express();

    var routes = require('./routes');
    var db = require('./db');
    var auth = require('./auth');

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    var mongodb_url = process.argv[3];
    app.db = db.connect(mongodb_url);
    routes.initializeRoutes(app);
    auth.initializeFacebookAuth(app);

    var port = process.argv[2];
    app.listen(port || 5000);
    console.log('Server listening on port ', port);
})();
