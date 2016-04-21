(function() {
  'use strict';
  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var models = {
    Print: mongoose.model('Print', {
      title: String,
      description: String,
      createdOn: Date,
      supportsRecommended: Boolean,
      gridFileId: {type: Schema.Types.ObjectId},
      gridPictureIds: [{type: Schema.Types.ObjectId}],
      categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
      plastics: [{type: Schema.Types.ObjectId, ref: 'Plastic'}],
      owner: {type: Schema.Types.ObjectId, ref: 'User'}
    }),

    Category: mongoose.model('Category', {
      title: String
    }),

    Keyword: mongoose.model('Keyword', {
      word: String
    }),

    User: mongoose.model('User', {
      name: String,
      email: String,
      avatar: {type: Schema.Types.ObjectId},
      userSince: Date,
      bio: String,
      prints: Array,
      location: String,
      facebookId: String
    }),

    Plastic: mongoose.model('Plastic', {
      name: String,
      description: String
    }),

    Printer: mongoose.model('Printer', {
      lastKnownIP: String,
      lastKnownPort: Number,
      serial: String
    }),

    PrintKeywordRelationship: mongoose.model('PrintKeywordRelationship', {
      keyword: {type: Schema.Types.ObjectId, ref: 'Keyword'},
      print: {type: Schema.Types.ObjectId, ref: 'Print'}
    }),

    PrinterUserRelationship: mongoose.model('PrinterUserRelationship', {
      user: {type: Schema.Types.ObjectId, ref: 'User'},
      printer: {type: Schema.Types.ObjectId, ref: 'Printer'},
      lastKnownIP: String,
      lastKnownPort: Number
    }),

    LikeRelationship: mongoose.model('LikeRelationship', {
      user: {type: Schema.Types.ObjectId, ref: 'User'},
      print: {type: Schema.Types.ObjectId, ref: 'Print'},
      createdOn: Date
    })
  };

  module.exports = models;
})();
