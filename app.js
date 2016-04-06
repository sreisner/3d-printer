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

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    app.db = db.connect('mongodb://localhost:27017/printer');
    routes.initializeRoutes(app);

    var port = process.argv[2];
    app.listen(port || 5000);
    console.log('Server listening on port ', port);
})();
