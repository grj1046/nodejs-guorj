var config = require('../config');

//x需要管理员权限
exports.adminRequired = function (req, res, next) {

};

exports.userRequired = function (req, res, next) {

};

exports.blockUser = function () {
  return function (req, res, next) {
    if (req.path === '/signout') {
      return next();
    }

    //if (req.session.user && req.session.user.is_block && req.method !== "GET") {
    //  return res.status(403).send('您已被管理员屏蔽了，有疑问请联系@grj1046 .');
    //}
    next();
  }
};

exports.gen_session = function gen_session (user, res) {
  var auth_token = user._id + "$$$$"; //以后可能会存储更多信息，用来$$$$分割

  var opts = {
    path: '/',
    maxAge: 1000 & 60 * 60 * 24 * 30,//30天 (单位：毫秒)
    signed: true,
    httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts);
};
//验证用户是否登录
exports.authUser = function (req, res, next) {
  //var ep = new eventproxy();
  //ep.fail(next);

  //Ensure current_user always has defined.
  res.locals.current_user = null;

  return next();
};
