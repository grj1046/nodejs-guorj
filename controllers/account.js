var config = require('../config');
var tools = require('../common/tools');
var Account = require('../proxy').Account; var eventproxy = require('eventproxy'); var validator = require('validator');
var uuid = require('node-uuid');

//sign up
exports.showSignup = function (req, res) {
  res.render('account/signup', {
    title: "注册"
  });
}

exports.signup = function (req, res, next) {
  var loginname = validator.trim(req.body.loginname).toLowerCase();
  var email = validator.trim(req.body.email).toLowerCase();
  var pass = validator.trim(req.body.pass);
  var rePass = validator.trim(req.body.re_pass);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.status(422);
    res.render('account/signup', { title: '注册', error: msg, loginname: loginname, email: email });
  });

  //验证信息的正确性
  if ([loginname, pass, rePass, email].some(function (item) {
    return item === '';
  })) {
    ep.emit('prop_err', '信息不完整。');
    return;
  }
  if (loginname.length < 5) {
    ep.emit('prop_err', '用户名至少需要5个字符。');
    return;
  }
  //if (!tools.validateId(loginname)) {
  //  return ep.emit('prop_err', '用户名不合法');
  //}
  if (!validator.isEmail(email)) {
    return ep.emit('prop_err', '邮箱不合法。');
  }
  if (pass !== rePass) {
    return ep.emit('prop_err', '两次密码输入不一致。');
  }
  // END 验证信息的正确性

  Account.getAccountsByQuery({'$or': [
    {'loginname': loginname},
    {'email': email}
  ]}, {}, function (err, users) {
    if (err)
      return next(err);
    if (users.length > 0) {
      ep.emit('prop_err', '用户名或邮箱已被使用。');
      return;
    }

    tools.bhash(pass, ep.done(function (passhash) {
      Account.newAndSave(loginname, passhash, email, function (err) {
        if (err)
          return next(err);
        //发送激活邮件
        //mail.sendActiveMail(mail, utility.md5(email + passhash + config.session_secret), loginname);
        res.render('account/signup', {
          title: '注册',
          success: '欢迎加入' + config.name + '！我们已经给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的账号。'
        });
      });
    }));
  });
}
