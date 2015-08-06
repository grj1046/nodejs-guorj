var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to $s error:', config.db, err.message);
    process.exit(1);
  }
});

//models
require('./user');
require('./account');
require('./article');
require('./article_content')

exports.User = mongoose.model('User');
exports.Account = mongoose.model('Account');
exports.Article = mongoose.model('Article');
exports.ArticleContent = mongoose.model('ArticleContent');