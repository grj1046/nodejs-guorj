var config = require('./config');
var express = require('express');

var apiArticle = require('./api/v1/article');

var apiRouter = express.Router();

apiRouter.post('/article/preview', apiArticle.preview);


module.exports = apiRouter;