var models = require('../models');
var ArticleContent = models.ArticleContent;

exports.getArticleContentById = function (content_id, callback) {
  ArticleContent.findOne({_id: content_id}, callback);
}

exports.newAndSave = function (article_id, content, callback) {
  var articleContent = new ArticleContent();
  articleContent.article_id = article_id;
  articleContent.content = content;
  articleContent.save(callback);
};
