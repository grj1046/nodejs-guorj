var mongoose = require('mongoose');
var config = require('../config');


//https://github.com/Automattic/mongoose/wiki/3.8-Release-Notes#connection-pool-sharing
var maindb = mongoose.createConnection(config.maindb);
var tmpdb = maindb.useDb(config.tmpdb_name || config.maindb + '_tmpdb'); //mongoose.createConnection(config.tmpdb);

maindb.on('error', function () {
    console.log('connect to db has an error。', arguments);
});

//models
var UserSchema = require('./user').UserSchema;
var AccountSchema = require('./account').AccountSchema;
var ArticleSchema = require('./article').ArticleSchema;
var ArticleContent = require('./article_content').ArticleContentSchema;
var DraftArticle = require('./draft_article').DraftArticle;
//maindb

exports.User = maindb.model('User', UserSchema);
exports.Account = maindb.model('Account', AccountSchema);
exports.Article = maindb.model('Article', ArticleSchema);
exports.ArticleContent = maindb.model('Article_content', ArticleContent);
//tmpdb
exports.DraftArticle = tmpdb.model('Draft_Article', DraftArticle);