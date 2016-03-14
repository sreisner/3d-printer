var url = require('url');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest : 'uploads/' });
var fs = require('fs');
var app = express();

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27018/printer');

var Category = mongoose.model('Category', {
    name: String
});

var Plastic = mongoose.model('Plastic', {
    name: String
});

var Print = mongoose.model('Print', {
    name: String,
    data: String,
    title: String,
    description: String,
    plastics: Array,
    supports: Boolean,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category
    }
});

app.get('/api/print', function(request, response) {
    var filter = {};
    var query = url.parse(request.url, true).query;
    if(query.category) {
        filter.category = query.category;
    }
    Print.find(filter, 'name title description plastics category supports').exec(function(err, prints) {
        if(err) {
            response.json({
                'error': err
            });
            return;
        }
        response.json(prints);
    });
});

app.get('/api/print/:print_id', function(request, response) {
    var printId = request.params.print_id
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

app.post('/api/print', upload.single('gcode'), function(request, response) {
    fs.readFile(request.file.path, function(err, data) {
        fs.unlink(request.file.path);
        if(err) {
            response.json({
                'error': err
            });
            return;
        }
        var print = new Print();
        print.data = data;
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

            response.json({});
        });
    });
});

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

app.listen(process.argv[2] || 5000);
