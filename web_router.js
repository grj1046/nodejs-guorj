var config = require('./config');
var express = require('express');

//var user = require('./controllers/user');
var site = require('./controllers/site');
var staticController = require('./controllers/static');
var user = require('./controllers/user');

var router = express.Router();
//home page
router.get('/', site.index);

// sign controller
if (config.allow_sign_up) {
  //router.get('signup', site.index);
  //router.post('signup', site.index);
} else {
  //router.get('signup', '')
}
//static page
router.get('/about', staticController.about);
router.get('/faq', staticController.faq);
router.get('/robots.txt', staticController.robots);

router.get('/user/:name', user.index);//用户个人主页

module.exports = router;
