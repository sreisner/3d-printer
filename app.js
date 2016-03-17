var url = require('url');
var path = require('path');
var morgan = require('morgan');
var multer  = require('multer');
var upload = multer({ dest : 'uploads/' });
var fs = require('fs');
var uuid = require('uuid');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27018/printer');
var Category = mongoose.model('Category', {
    name: String
});

var Plastic = mongoose.model('Plastic', {
    name: String
});

var Print = mongoose.model('Print', {
    dataId: String,
    categoryId: String,
    imageId: String,
    title: String,
    description: String,
    plastics: Array,
    supports: Boolean
});

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(mongoose.connection.db);

app.get('/api/print', function(request, response) {
    var filter = {};
    var query = url.parse(request.url, true).query;
    if(query.category) {
        filter.category = query.category;
    }
    Print.find(filter).exec(function(err, prints) {
        if(err) {
            response.json({
                'error': err
            });
            return;
        }
        response.json(prints);
    });
});

app.get('/api/print/:printId', function(request, response) {
    var printId = request.params.printId
    Print.findOne({ _id: printId }, 'data', function(err, print) {
        if(err) {
            response.json({
                'error': err
            });
            return;
        }
        response.end(print.data);
    });
});

app.get('/api/grid/:gridId', function(request, response) {
    var gridId = request.params.gridId;

    gfs.findOne({ _id: gridId }, function(err, metadata) {
        if(err) {
            response.json({
                'error': err
            });
            return;
        }
        var readStream = gfs.createReadStream({
            _id: gridId
        });
        response.writeHead(200, {'Content-Type': metadata.contentType });
        readStream.pipe(response);
        readStream.on('close', function() {
            response.end();
        });
    });
});

var uploadedFileMetadata = upload.fields([{ name: 'STL', maxCount: 1 }, { name: 'photo', maxCount: 8 }])
app.post('/api/print', uploadedFileMetadata, function(request, response) {
    var print = new Print();

    var stlMetadata = request.files['STL'][0];
    var imageMetadata = request.files['photo'][0];
    var gridPromises = [
        uploadFileToGridFS(stlMetadata.path, 'binary/octet-stream'),
        uploadFileToGridFS(imageMetadata.path, 'image/jpeg')
    ];
    Promise.all(gridPromises).then(function(gridIds) {
        print.dataId = gridIds[0];
        print.imageId = gridIds[1];
        fs.unlink(stlMetadata.path);
        fs.unlink(imageMetadata.path);
        print.category = request.body.category;
        print.title = request.body.title;
        print.description = request.body.description;
        // If a single plastic is selected it doesn't come in as an array,
        // and this concatenation trick creates an array regardless.
        print.plastics = [].concat(request.body.plastics);

        var supports = request.body.supports;
        if(supports === 'yes') {
            print.supports = true;
        } else if(supports === 'no') {
            print.supports = false;
        } else {
            print.supports = null;
        }

        print.save(function(err) {
            if(err) {
                response.json({
                    'error': err
                });
                return;
            }

            response.redirect('/');
        });
    });
});

function uploadFileToGridFS(filePath, mimeType) {
    return new Promise(function(resolve, reject) {
        var readStream = fs.createReadStream(filePath);
        var gridFilename = uuid.v1();
        var writeStream = gfs.createWriteStream({
            filename: gridFilename,
            mode: 'w',
            content_type: mimeType
        });
        readStream.pipe(writeStream);
        writeStream.on('close', function(file) {
            resolve(file._id);
        });
    });
}

app.get('/api/category', function(request, response) {
    Category.find({}).exec(function(err, categories) {
        if(err) {
            response.json({
                'error': err
            });
            return;
        }
        response.json(categories);
    });
});

app.get('/api/plastic', function(request, response) {
    Plastic.find({}).exec(function(err, plastics) {
        if(err) {
            response.json({
                'error': err
            });
            return;
        }
        response.json(plastics);
    })
});

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'static', 'views', 'index.html'));
});

app.get('/upload', function(request, response) {
    response.sendFile(path.join(__dirname, 'static', 'views', 'upload.html'));
});

app.listen(process.argv[2] || 5000);
