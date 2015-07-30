var models = require('../models');
var User = models.User;

/*
 * 根据用户名列表查找用户列表
 * callback:
 * - err, 数据库异常
 * －users, 用户列表
* */
exports.getUserByNames = function (names, callback) {
  if (names.length === 0) {
    return callback(null, []);
  }
  User.find({ name: {$in: names }}, callback)
}
