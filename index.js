(function() {
    'use strict';
    var bodyParser = require('body-parser');
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

    module.exports = {
      addApiHooks: addApiHooks
    };
})();
