var bcrypt = require('bcrypt');
var moment = require('moment');

moment.locale('zh-cn');//使用中文

//格式化时间
exports.formatDate = function (date, friendly, useFullDate) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        var format;
        //if publish in current year, don't show YYYY
        var currentYear = new Date().getFullYear();
        if (useFullDate || date.year() !== currentYear)
            format = "YYYY-MM-DD HH:mm:ss.SSS (ZZ)";
        else
            format = "MM-DD HH:mm:ss.SSS (ZZ)";
        return date.format(format);
    }
};

exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
    //bcrypt.hash(str, 10, callback);
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(str, salt, callback);
    });
};

exports.bcompare = function (str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};
