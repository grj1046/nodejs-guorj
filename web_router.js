var config = require('./config');
var express = require('express');

//var user = require('./controllers/user');
var site = require('./controllers/site');
var staticController = require('./controllers/static');
var user = require('./controllers/user');
var account = require('./controllers/account');

var router = express.Router();
//home page
router.get('/', site.index);

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

module.exports = router;
