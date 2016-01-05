var EventProxy = require('eventproxy');
var moment = require('moment');
var renderHelper = require('../../common/render_helper');
var proxy = require('../../proxy');
var ProxyDraftArticle = proxy.DraftArticle;

/**
 * 将markdown格式的文章转换为html格式
 */
exports.preview = function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var mdContent = renderHelper.markdown(content);
  res.json({
    title: title, 
    content: mdContent
  });
};

exports.postDraft = function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var t = req.params.t;
  var ep = new EventProxy();
  ep.fail(next);
  ep.on('return_CreateTime', function(createTime) {
    res.json({
      t: new Date(createTime).getTime()
    });
  });
  var user_id = req.session.user.id;
  var create_at = new Date(parseInt(t));
  ProxyDraftArticle.getOrCreate(user_id, title, content, create_at, function (err, draft_article) {
    if (err) {
      return next(err);
    }
    ep.emit('return_CreateTime', draft_article.create_at);
  });
}