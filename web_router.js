var config = require('./config');
var express = require('express');

//var user = require('./controllers/user');
var site = require('./controllers/site');
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

module.exports = router;
