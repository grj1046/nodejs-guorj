var mongoose = require('mongoose');
var config = require('../config');


//https://github.com/Automattic/mongoose/wiki/3.8-Release-Notes#connection-pool-sharing
var maindb = mongoose.createConnection(config.maindb);
//var tmpdb = maindb.useDb(config.tmpdb_name); //mongoose.createConnection(config.tmpdb);

//models
var UserSchema = require('./user').UserSchema;
var AccountSchema = require('./account').AccountSchema;
var ArticleSchema = require('./article').ArticleSchema;
var ArticleContent = require('./article_content').ArticleContentSchema;
//maindb

exports.User = maindb.model('User', UserSchema);
exports.Account = maindb.model('Account', AccountSchema);
exports.Article = maindb.model('Article', ArticleSchema);
exports.ArticleContent = maindb.model('Article_content', ArticleContent);
//tmpdb