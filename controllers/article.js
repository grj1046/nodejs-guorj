/**
 * article
 */
var eventproxy = require('eventproxy');
var validator = require('validator');
var Article = require('../proxy').Article;

exports.index = function (req, res) {
  res.render('article/index', {
    title: '文章列表'
  })
};

exports.showCreate = function (req, res) {
  res.render('article/create', {
    title: '创建文章'
  });
};

exports.create = function (req, res, next) {
  var title = validator.trim(req.body.title);
  title = validator.escape(title);
  var content = validator.trim(req.body.content);
  
  //验证
  var editError;
  if (title === '') {
    editError = "标题不能为空";
  } else if (title.lentgh < 1 || title.length > 50) {
    editError = "标题长度为1~100个字符";
  } else if (content === '') {
    editError = "内容不能为空";
  }
  //END 验证
  
  if (editError) {
    res.status(422);
    return res.render('article/create', {
      title: "添加文章",
      edit_error: editError
    })
  }
  var ep = new eventproxy();
  ep.fail(next);
    
  ep.all("article_saved", function (article) {
    res.redirect('/article/' + article.id);
  });
  //文章摘要
  Article.newAndSave(title, content, req.session.user._id, function (err, article) {
    if (err) {
      return next(err);
    }
    ep.emit("article_saved", article);
  });
};