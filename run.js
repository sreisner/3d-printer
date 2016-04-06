(function() {
  'use strict';

  var app = require('./server');
  var port = process.argv[2] || 5000;
  app.listen(port, function() {
    console.log('Listening on port', port);
  });
})();
