(function() {
  'use strict';
  var url = require('url');
  var uuid = require('uuid');
  var fs = require('fs');
  var multer = require('multer');
  var upload = multer({dest: 'uploads/'});

  function initializeApiRoutes(app) {
    app.get('/api/print', function(request, response) {
      var filter = {};
      var query = url.parse(request.url, true).query;
      if (query.category) {
        filter.categoryId = query.category;
      }
      app.db.models.Print.find(filter).exec(function(err, prints) {
        if (err) {
          response.json({
            error: err
          });
          return;
        }
        response.json(prints);
      });
    });

    app.get('/api/print/:printId', function(request, response) {
      var printId = request.params.printId;
      app.db.models.Print.findOne({_id: printId}, function(err, print) {
        if (err) {
          response.json({
            error: err
          });
          return;
        }
        response.json(print);
      });
    });

    app.get('/api/grid/:gridId', function(request, response) {
      var gridId = request.params.gridId;

      app.db.grid.findOne({_id: gridId}, function(err, metadata) {
        if (err) {
          response.json({
            error: err
          });
          return;
        }
        if (!metadata) {
          response.json({
            error: 'Could not find a grid object with id=' + gridId
          });
          return;
        }
        var readStream = app.db.grid.createReadStream({
          _id: gridId
        });
        response.writeHead(200, {'Content-Type': metadata.contentType});
        readStream.pipe(response);
        readStream.on('close', function() {
          response.end();
        });
      });
    });

    var uploadedFileMetadata = upload.fields([
      {name: 'STL', maxCount: 1},
      {name: 'pictures', maxCount: 8}
    ]);
    app.post('/api/print', uploadedFileMetadata, function(request, response) {
      try {
        var print = new app.db.models.Print();
        var stlFiles = request.files.STL;
        if (stlFiles.length === 0) {
          throw new Error('No STL files found in reqeust');
        }
        var stlPath = stlFiles[0].path;
        var picturesMetadata = request.files.pictures;
        var gridPromises = [];
        gridPromises.push(uploadToGridFS(stlPath, 'binary/octet-stream'));
        picturesMetadata.forEach(function(metadata) {
          gridPromises.push(uploadToGridFS(metadata.path, 'image/jpeg'));
        });
        Promise.all(gridPromises).then(function(gridIds) {
          print.title = request.body.title;
          print.description = request.body.description;
          print.createdOn = new Date();
          var supports = request.body.supports;
          if (supports === 'yes') {
            print.supports = true;
          } else if (supports === 'no') {
            print.supports = false;
          } else {
            print.supports = null;
          }
          print.gridFileId = gridIds[0];
          print.gridPictureIds = gridIds.slice(1);
          fs.unlink(stlPath);
          picturesMetadata.forEach(function(metadata) {
            fs.unlink(metadata.path);
          });
          print.categoryId = request.body.category;
          // If a single plastic is selected on the form, it doesn't come in as
          // an array, and this concatenation creates an array regardless.
          print.plastics = [].concat(request.body.plastics);
          print.save(function(err, newPrint) {
            if (err) {
              response.json({
                error: err
              });
              return;
            }

            response.json(newPrint);
          });
        });
      } catch (e) {
        response.json({
          error: 'An unexpected error occurred trying to upload a print.'
        });
      }
    });

    function uploadToGridFS(filePath, mimeType) {
      return new Promise(function(resolve, reject) {
        var gridFilename = uuid.v1();
        var writeStream = app.db.grid.createWriteStream({
          filename: gridFilename,
          mode: 'w',
          /* eslint-disable camelcase */
          content_type: mimeType
          /* eslint-enable camelcase */
        });
        var readStream = fs.createReadStream(filePath);
        readStream.on('error', function(err) {
          reject({error: err});
        });
        readStream.pipe(writeStream);
        writeStream.on('error', function(err) {
          reject({error: err});
        });
        writeStream.on('close', function(file) {
          resolve(file._id);
        });
      });
    }

    app.get('/api/category', function(request, response) {
      app.db.models.Category.find().exec(function(err, categories) {
        if (err) {
          response.json({
            error: err
          });
          return;
        }
        response.json(categories);
      });
    });

    app.get('/api/category/:categoryId', function(request, response) {
      var categoryId = request.params.categoryId;
      var categoryModel = app.db.models.Category;
      categoryModel.findOne({_id: categoryId}, function(err, category) {
        if (err) {
          response.json({
            error: err
          });
          return;
        }
        response.json(category);
      });
    });

    app.get('/api/plastic', function(request, response) {
      app.db.models.Plastic.find().exec(function(err, plastics) {
        if (err) {
          response.json({
            error: err
          });
          return;
        }
        response.json(plastics);
      });
    });
  }

  module.exports = {
    initializeRoutes: initializeApiRoutes
  };
})();
