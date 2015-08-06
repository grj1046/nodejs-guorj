var config = require('../config');
var UserProxy = require('../proxy').User;
var util = require('util');
var eventproxy = require('eventproxy');

exports.index = function (req, res, next) {
  var user_id = req.params.id;
  
  var ep = new eventproxy();
  ep.fail(next);
  ep.on('render_user', function(user) {
    res.render('/user/index', {
      title: util.format("@%s 的个人主页", user.nickname),
      user: user
    });
  });
  
  UserProxy.getUserById(user_id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render404('用户不存在。');
      return;
    }
    ep.emit('render_user', user);
  });
};
