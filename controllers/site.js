var EventProxy = require('eventproxy');
var moment = require('moment');
var proxy = require('../proxy');
var ProxyArticle = proxy.Article;
var config = require('../config');

exports.index = function (req, res, next) {
  var ep = new EventProxy();
  ep.fail(next);
  ep.all('get_articles', function (articles, pages) {
    res.render('index', {
      title: '首页',
      articles: articles
    });
  });
  var limit = 20;//pageSize
  var query = {};
  var options = { limit: limit, sort: '-update_at -create_at'};
  ProxyArticle.getArticlesByQuery(query, options, function (err, articles) {
    if (err) {
      return next(err);
    };
    ep.emit('get_articles', articles || []);
  });
}
