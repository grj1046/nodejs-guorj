var models = require('../models');
var User = models.User;
var uuid = require('node-uuid');

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
};
/**
 * 添加用户
 */
exports.newAndSave = function (loginname, email, callback) {
  var user = new User();
  user.name = loginname,
  user.email = email;
  user.access_token = uuid.v4();
  
  user.save(callback);
};
/**
 * 根据用户id查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
  User.findOne({_id: id}, callback);
};