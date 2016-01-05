var models = require('../models');
var Article = models.Article;

exports.getArticles = function (callback) {
  Article.find(callback);
};

exports.getArticleById = function (article_id, callback) {
  Article.findOne({ _id: article_id }, callback);
};

exports.newAndSave = function (title, content, current_user_id, callback) {
  var article = new Article();
  article.title = title;
  article.summary = content.substr(0, 200);
  article.author_id = current_user_id;
  //article.content_id
  article.save(callback);
};