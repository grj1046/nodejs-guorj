var mongoose = require('mongoose');
var ArticleContent = mongoose.model('ArticleContent');

exports.newAndSave = function (article_id, content, callback) {
	var articleContent = new ArticleContent();
	articleContent.article_id = article_id;
	articleContent.content = content;
	articleContent.save(callback);
};
