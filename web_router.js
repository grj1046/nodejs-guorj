var config = require('./config');
var express = require('express');

var site = require('./controllers/site');
var staticController = require('./controllers/static');
var user = require('./controllers/user');
var account = require('./controllers/account');
var article = require('./controllers/article');
var auth = require('./middlewares/auth');

var router = express.Router();
//home page
router.get('/', site.index);

//favicon
router.get('/favicon.ico', staticController.favicon);

// account controller
if (config.allow_sign_up) {
  router.get('/signup', account.showSignup);
  router.post('/signup', account.signup);
} else {
  //router.get('signup', '')
}
router.get('/login', account.showLogin);
router.post('/login', account.login);//登录
router.post('/logout', account.logout);//退出

//static page
router.get('/about', staticController.about);
router.get('/faq', staticController.faq);
router.get('/robots.txt', staticController.robots);

//user
router.get('/user/:id', user.index);//用户个人主页

//article
router.get('/articles', article.index);//文章列表
router.get('/articles/create', auth.loginRequired, article.showCreate);//显示新建文章界面
router.post('/articles/create', auth.userRequired, article.create);//新建文章
router.get('/article/preview/:t', auth.loginRequired, article.preview);//预览
router.get('/article/:id', article.showArticle);//显示一篇文章
router.get('/article/:id/edit', auth.loginRequired, article.showUpdate);//显示更新文章界面
//router.post('/article/:id/edit', auth.userRequired, article.update);//更新文章

//router.post('/article/preview/:t', auth.userRequired, article.preview);//预览

module.exports = router;
