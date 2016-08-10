/*
 * 给所有的Model扩展功能
 * http://mongoosejs.com/docs/plugins.html
 * */
var tools = require('../common/tools');
var moment = require('moment');

module.exports = function (schema) {
  schema.methods.create_at_ago = function () {
    //如果发布时间超过一个月，则显示具体时间。
    var friendly = moment(this.create_at).add(1, 'M').isBefore(Date.now());
    return tools.formatDate(this.create_at, !friendly);
  };

  schema.methods.updated_at_ago = function () {
    return tools.formatDate(this.create_at, true);
  };
  
  schema.methods.create_time = function() {
    return moment(this.create_at).format("YYYY-MM-DD HH:mm:ss.SSS (ZZ)")
  };
  
  schema.methods.update_time = function() {
    return moment(this.create_at).format("YYYY-MM-DD HH:mm:ss.SSS (ZZ)")
  };
};
