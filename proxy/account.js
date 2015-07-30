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
exports.newAndSave = function (loginname, passhash, email, callback) {
  var account = new Account();
  account.loginname = loginname;
  account.passhash = passhash;
  account.email = email;

  account.save(callback);
}
