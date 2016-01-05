var config = require('./config');
var express = require('express');
var auth = require('./middlewares/auth');

var apiArticle = require('./api/v1/article');

var apiRouter = express.Router();

apiRouter.post('/article/preview', apiArticle.preview);
apiRouter.post('/article/postDraft/:t', auth.userRequired, apiArticle.postDraft)

module.exports = apiRouter;