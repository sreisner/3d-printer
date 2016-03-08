var url = require('url');
var mongoose = require('mongoose');
var express = require('express');
var app = express()

mongoose.connect('mongodb://localhost:27017/printer');

var Category = mongoose.model('Category', {
    name: String
});

var Plastic = mongoose.model('Plastic', {
    name: String
});

var Print = mongoose.model('Print', {
    name: String,
    data: String,
    plastics: Array,
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
    Print.find(filter, 'name plastics category').exec(function(err, prints) {
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
    })
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
    })
})

app.listen(process.argv[2] || 5000);
