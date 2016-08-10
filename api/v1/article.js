var EventProxy = require('eventproxy');
var validator = require('validator');
var moment = require('moment');
var renderHelper = require('../../common/render_helper');
var proxy = require('../../proxy');
var ProxyArticle = proxy.Article;
var ProxyArticleContent = proxy.ArticleContent;
var ProxyDraftArticle = proxy.DraftArticle;

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
    return res.json({
      edit_error: editError
    })
  }
  var ep = new EventProxy();
  ep.fail(next);

  ep.all("article_saved", function (article) {
    res.json({
      ArticleId: article.id
    });
  });
  ProxyArticle.newAndSave(title, content, req.session.user._id, function (err, article) {
    if (err) {
      return next(err);
    }
    ProxyArticleContent.newAndSave(article._id, content, function (conErr, articleContent) {
      if (conErr) {
        return next(conErr);
      }
      article.content_id = articleContent._id;
      article.save(function (updateErr, updatedArticle) {
        if (updateErr) {
          return next(updateErr);
        }
        ProxyDraftArticle.deleteDraftsByUserId(req.session.user._id, function () { });
        ep.emit("article_saved", updatedArticle);
      });
    });//END ProxyArticleContent
  });
}

exports.update = function (req, res, next) {
  var article_id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;
  if(!validator.isMongoId(article_id)){
    return res.render404('文章不存在');
  }
  //检查该篇文章的拥有者
  ProxyArticle.getArticleById(article_id, function (articleErr, article) {
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
        return res.json({
          edit_error: editErr,
          article: { _id: article_id, title: title, content: content }
        });
      }

      ProxyArticleContent.newAndSave(article._id, content, function (conErr, articleContent) {
        if (conErr) {
          return next(conErr);
        }
        article.title = title;
        article.summary = content.substr(0, 200);
        article.content_id = articleContent._id;
        article.update_at = new Date();
        article.save(function (updateErr, updateArticle) {
          if (updateErr) {
            return next(updateErr);
          }
          ProxyDraftArticle.deleteDraftsByUserId(req.session.user._id, function () { });
          res.json({
           ArticleId: article._id 
          });
        });
      });
    } else {
      res.status(403)
      res.json({
        notify: '对不起，你不能编辑此文章。'
      });
    }
  });
}

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
  var article_id = req.body.article_id;
  var title = req.body.title;
  var content = req.body.content;
  var t = req.params.t;
  var ep = new EventProxy();
  ep.fail(next);
  ep.on('return_CreateTime', function (createTime) {
    res.json({
      t: new Date(createTime).getTime()
    });
  });
  var user_id = req.session.user.id;
  
  //检查该篇文章的拥有者
  ProxyArticle.getArticleById(article_id, function (articleErr, article) {
    if (articleErr) {
      return next(articleErr);
    };
    if (article.author_id.equals(user_id) || req.session.user.is_admin) {
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
        return res.json({
          edit_error: editErr,
          article: { _id: article_id, title: title, content: content }
        });
      }

      var create_at = new Date(parseInt(t));
      ProxyDraftArticle.getOrCreate(user_id, title, content, create_at, function (err, draft_article) {
        if (err) {
          return next(err);
        }
        ep.emit('return_CreateTime', draft_article.create_at);
      });
    } else {
      res.status(403)
      res.json({
        edit_error: '对不起，你不能编辑此文章。'
      });
    }
  });
}