(function() {
    'use strict';
    var mongoose = require('mongoose');
    var gridfsStream = require('gridfs-stream');

    var models = require('./models');

    function connect(dbUrl) {
        mongoose.connect(dbUrl);
        gridfsStream.mongo = mongoose.mongo;
        var grid = gridfsStream(mongoose.connection.db);
        return {
            grid: grid,
            models: models
        };
    }

    module.exports = {
        connect: connect,
    };
})();
