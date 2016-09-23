/**
 * article
 */
var EventProxy = require('eventproxy');
var moment = require('moment');
var utils = require('utility');
var proxy = require('../proxy');
var renderHelper = require('../common/render_helper');
var validator = require('validator');
var ProxyArticle = proxy.Article;
var ProxyArticleContent = proxy.ArticleContent;
var ProxyDraftArticle = proxy.DraftArticle;
/*
var hljs = require('highlight.js') // https://highlightjs.org/
var MarkdownIt = require('markdown-it');

// set default optioins
//https://markdown-it.github.io/markdown-it.js
var md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) { }
    }

    return str;
  }
});

md.set({
  //html: true, // enable HTML tags in source
  xHtmlOut: true, //user '/' to close single tags (<br />)
  breaks: true, // convert '\n' in paragraphs into <br>
  linkify: false, //not autoconvert URL-like text to links
  typographer: true, //enable smartypants and other sweet transforms
});*/
exports.index = function (req, res, next) {
    var page = parseInt(req.query.page) || 1;//pageIndex
    page = page > 0 ? page : 1;

    var ep = new EventProxy();
    ep.fail(next);
    ep.all('get_articles', 'pages', function (articles, pages) {
        res.render('article/index', {
            title: '文章列表',
            articles: articles,
            pages: pages,
            current_page: page
        });
    });
    var limit = 20;//pageSize
    var query = {};
    var options = { skip: (page - 1) * limit, limit: limit, sort: '-update_at -create_at' };
    ProxyArticle.getArticlesByQuery(query, options, function (err, articles) {
        if (err) {
            return next(err);
        };
        ep.emit('get_articles', articles || []);
    });

    //取分页数据
    ProxyArticle.getCount({}, ep.done(function (articleCount) {
        var pages = Math.ceil(articleCount / limit);
        ep.emit('pages', pages);
    }));
    //END 取分页数据
};

exports.showArticle = function (req, res, next) {
    var article_id = req.params.id;
    if (article_id === '' || article_id === 'preview' || !validator.isMongoId(article_id)) {
        return res.render404('文章不存在');
    }
    var ep = new EventProxy();
    ep.fail(next);
    ep.on('get_article', function (article) {
        res.render('article/show', {
            title: article.title,
            article: article
        });
    });

    ProxyArticle.getArticleById(article_id, function (err, article) {
        if (err) {
            return next(err);
        }
        if (!article) {
            return res.render404('文章不存在');
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
                //article.content = md.render(articleContent.content);
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
};

exports.showUpdate = function (req, res, next) {
    var article_id = req.params.id;
    var ep = new EventProxy();
    ep.fail(next);
    if (!validator.isMongoId(article_id)) {
        return res.render404('该文章不存在。');
    }
    ep.on('get_article', function (article) {
        res.render('article/edit', {
            title: "编辑",
            article: article
        });
    });
    ProxyArticle.getArticleById(article_id, function (err, article) {
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
    if (!validator.isMongoId(article_id)) {
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
                return res.render('article/edit', {
                    title: '编辑',
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
                    res.redirect('/article/' + article._id);
                });
            });
        } else {
            res.renderError('对不起，你不能编辑此文章。', 403);
        }
    });
};

/*
* 文章预览
*/
exports.preview = function (req, res, next) {
    var t = req.params.t; //draft article id
    var ep = new EventProxy();
    ep.fail(next);
    ep.on('article_preview', function (draft_article, list) {
        res.render('article/preview', {
            title: "文章预览：" + draft_article.title,
            article: draft_article,
            list: list
        });
    });
    var user_id = req.session.user.id;
    var create_at = new Date(parseInt(t));
    ProxyDraftArticle.getByCreateTime(user_id, create_at, function (err, draft_article) {
        if (err) {
            return next(err);
        }

        if (!draft_article) {
            return res.render('notify/notify', {
                title: '预览',
                error: 'no preview'
            });
        }

        var mdContent = renderHelper.markdown(draft_article.content);
        draft_article.content = mdContent;
        ProxyDraftArticle.getUserDrafts(user_id, function (errGet, drafts) {
            if (errGet) {
                return next(errGet);
            }
            var list = [];
            for (var i = drafts.length - 1; i >= 0; i--) {
                var draft = {
                    url: drafts[i].create_at.getTime(),
                    title: drafts[i].title,
                    save_time: moment(drafts[i].create_at).format("YYYY/MM/DD HH:mm:ss:SSS")
                };
                list.push(draft);
            }

            //for (var draft in drafts) {}
            //TODO:在此处将url和保存时间记录下来  [{url: "", saveTime: "" }]
            ep.emit('article_preview', draft_article, list);
        });
    });
};