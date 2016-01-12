var bcrypt = require('bcrypt');
var moment = require('moment');

moment.locale('zh-cn');//使用中文

//格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
  }
};

exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  //bcrypt.hash(str, 10, callback);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(str, salt, callback);
});
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};
