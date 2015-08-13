/**
 * article
 */
var EventProxy = require('eventproxy');
var validator = require('validator');
var Article = require('../proxy').Article;
var ProxyArticleContent = require('../proxy').ArticleContent;
var renderHelper = require('../common/render_helper');

exports.index = function (req, res, next) {
  var ep = new EventProxy();
  ep.fail(next);
  ep.on('get_articles', function (articles) {
    res.render('article/index', {
      title: '文章列表',
      articles: articles
    });
  });
  
  Article.getArticles(function (err, articles) {
    if (err) {
      return next(err);
    };
    ep.emit('get_articles', articles);
  });
};

exports.showArticle = function (req, res, next) {
  var article_id = req.params.id;
  if (article_id === '') {
    res.render404("参数出错");
  }
  var ep = new EventProxy();
  ep.fail(next);
  ep.on('get_article', function (article) {
    res.render('article/show', {
      title: article.title,
      article: article
    });
  });
  
  Article.getArticleById(article_id, function (err, article) {
    if (err) {
      return next(err);
    }
    if (article.content_id === undefined) {
      article.content = article.summary;
      return ep.emit('get_article', article);
    }
    ProxyArticleContent.getArticleContentById(article.content_id, function (conErr, articleContent) {
      if (conErr) {
        return next(conErr);
      }
      if (articleContent != null) {
        article.content = renderHelper.markdown(articleContent.content);
        //article.content = articleContent.content;
      } else {
        article.content = '';
      }
      ep.emit('get_article', article);
    });
  });
}

exports.showCreate = function (req, res) {
  res.render('article/create', {
    title: '创建文章'
  });
};

exports.create = function (req, res, next) {
  var title = validator.trim(req.body.title);
  title = validator.escape(title);
  var content = req.body.content;
  
  //验证
  var editError;
  if (title === '') {
    editError = "标题不能为空";
  } else if (title.lentgh < 1 || title.length > 50) {
    editError = "标题长度为1~50个字符";
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
  var ep = new EventProxy();
  ep.fail(next);
    
  ep.all("article_saved", function (article) {
    res.redirect('/article/' + article.id);
  });
  Article.newAndSave(title, content, req.session.user._id, function (err, article) {
    if (err) {
      return next(err);
    }
    ProxyArticleContent.newAndSave(article._id, content, function(conErr, articleContent) {
      if (conErr) {
        return next(conErr);
      }
      article.content_id = articleContent._id;
      article.save(function (updateErr, updatedArticle) {
        if (updateErr) {
          return next(updateErr);
        }
        ep.emit("article_saved", updatedArticle);
      });
    });//END ProxyArticleContent
  });
};

exports.showUpdate = function (req, res, next) {
  var article_id = req.params.id;
  var ep = new EventProxy();
  ep.fail(next);
  ep.on('get_article', function (article) {
    res.render('article/edit', {
      title: "编辑",
      article: article
    });
  });
  Article.getArticleById(article_id, function (err, article) {
    if (err) {
      return next(err);
    }
    ProxyArticleContent.getArticleContentById(article.content_id, function (conErr, articleContent) {
      if (conErr) {
        return next(conErr);
      }
      article.content = articleContent != null ? articleContent.content : '';
      ep.emit('get_article', article);
    });
  });
};

exports.update = function (req, res, next) {
  var article_id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;
  //检查改篇文章的拥有者
  Article.getArticleById(article_id, function (articleErr, article) {
    if (articleErr) {
      return next(articleErr);
    };
    if (article.author_id.equals(req.session.user._id) || req.session.user.is_admin) {
      title = validator.trim(title);
      title = validator.escape(title);
      content = validator.trim(content);
      //验证
      var editErr;
      if (title === '') {
        editErr = '标题不能为空。';
      } else if (title.length < 1 || title.length > 50) {
        editErr = "标题长度为1~50个字符，当前标题长度为：" + title.length;
      }
      //END 验证
      
      if (editErr) {
        return res.render('article/edit', {
          title: '编辑',
          edit_error: editErr,
          article: {_id: article_id, title: title, content: content}
        });
      }
      
      ProxyArticleContent.newAndSave(article._id, content, function (conErr, articleContent) {
        if (conErr) {
          return next(conErr);
        }
        article.title = title;
        article.content_id = articleContent._id;
        article.update_at = new Date();
        article.save(function (updateErr, updateArticle) {
          if (updateErr) {
            return next(updateErr);
          }
          res.redirect('/article/' + article._id);
        });
      });
    } else {
      res.renderError('对不起，你不能编辑此文章。', 403);
    }
  });
};