var config = require('./config');
var express = require('express');
var auth = require('./middlewares/auth');

var apiArticle = require('./api/v1/article');

var apiRouter = express.Router();

apiRouter.post('/article/preview', apiArticle.preview);
apiRouter.post('/articles/create', auth.userRequired, apiArticle.create)
apiRouter.post('/article/:id/edit', auth.userRequired, apiArticle.update);//更新文章
apiRouter.post('/article/postDraft/:t', auth.userRequired, apiArticle.postDraft)

module.exports = apiRouter;