var models = require('../models');
var Account = models.Account;

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err,
 * - users, 
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getAccountsByQuery = function (query, opt, callback) {
  Account.find(query, '', opt, callback);
};

/**
 * 注册新用户
 */
exports.newAndSave = function (loginname, passhash, email, user_id, callback) {
  var account = new Account({ 
    loginname: loginname,
    passhash: passhash,
    email: email,
    user_id: user_id
  });
  
  account.save(callback);
};
/**
 * 根据登录名查找用户
 * callback:
 * - err, 数据库异常
 * - account, 用户账户
 * @param {String} loginname 登录名
 * @param {Function} callback 回调函数
 */
exports.getAccountByLoginname = function (loginname, callback) {
  Account.findOne({'loginname': loginname}, callback);
};
/**
 * 根据邮箱查找用户
 * callback:
 * - err, 数据库异常
 * - account, 用户账户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getAccountByEmail = function (email, callback) {
  Account.findOne({email: email}, callback);
};