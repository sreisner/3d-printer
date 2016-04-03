(function() {
    'use strict';

    var path = require('path');
    var express = require('express');
    var app = express();

    const DIST_PATH = path.join(__dirname, 'dist');
    app.use('/javascript', express.static(path.join(DIST_PATH, 'javascript')));
    app.use('/css', express.static(path.join(DIST_PATH, 'css')));

    app.get('/', function(request, response) {
        response.sendFile(path.join(__dirname, 'site', 'index.html'));
    });
    app.get('/login', function(request, response) {
        response.sendFile(path.join(__dirname, 'site', 'login.html'));
    });

    module.exports = app;
})();
