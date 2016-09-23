var config = require('../config');
var tools = require('../common/tools');
var Account = require('../proxy').Account;
var User = require('../proxy').User;
var authMiddleWare = require('../middlewares/auth');
var EventProxy = require('eventproxy');
var validator = require('validator');
var uuid = require('node-uuid');

//sign up
exports.showSignup = function (req, res) {
    res.render('account/signup', {
        title: "注册"
    });
};

exports.signup = function (req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var email = validator.trim(req.body.email).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var rePass = validator.trim(req.body.re_pass);

    var ep = new EventProxy();
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

    Account.getAccountsByQuery({
        '$or': [
          { 'loginname': loginname },
          { 'email': email }
        ]
    }, {}, function (err, accounts) {
        if (err)
            return next(err);
        if (accounts.length > 0) {
            ep.emit('prop_err', '用户名或邮箱已被使用。');
            return;
        }
        User.newAndSave(loginname, email, function (err, user) {
            if (err) {
                return next(err);
            }
            tools.bhash(pass, ep.done(function (passhash) {
                Account.newAndSave(loginname, passhash, email, user._id, function (err) {
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
        });//end User newAndSave
    });
};

/**
 * show user login page
 * 
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
exports.showLogin = function (req, res) {
    req.session._loginReferer = req.headers.referer;
    res.render('account/login', {
        title: "登录"
    })
};

/**
 * define some page when login just jump to the home page
 *  @type {Array}
 */
var notJump = [
  '/active_account', //active page
  '/reset_pass', // reset password page, avoid to reset twice
  '/signup', //regist page
  '/search_pass' //search pass page
]

/**
 * handle user login
 * 
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var ep = new EventProxy();

    ep.fail(next);

    if (!loginname || !pass) {
        res.status(422);
        return res.render('account/login', {
            title: "登录",
            error: "信息不完整。"
        })
    }

    var getAccount;
    if (loginname.indexOf('@') !== -1) {
        getAccount = Account.getAccountByEmail;
    } else {
        getAccount = Account.getAccountByLoginname;
    }

    ep.on('login_error', function (logi_error) {
        res.status(403);
        res.render('account/login', {
            title: "登录",
            error: "用户名或者密码错误。"
        });
    });

    getAccount(loginname, function (err, account) {
        if (err) {
            return next(err);
        }

        if (!account) {
            return ep.emit('login_error');
        }

        var passhash = account.passhash;
        tools.bcompare(pass, passhash, ep.done(function (bool) {
            if (!bool) {
                return ep.emit('login_error');
            }
            /*
            if (!account.active) {
              //mail.sendActiveMail(account.email, utility.md5(account.email + passhash + config.session_secret), account.loginname);
              res.status(403);
              res.render('account/login', {
                title: "登录",
                error: '此帐号还没有被激活，激活连接已发送到 ' + account.email + '邮箱，请查收。'
              })
            }*/
            User.getUserById(account.user_id, function (err, user) {
                if (err) {
                    return next(err);
                }
                // store session cookie
                authMiddleWare.gen_session(user, res)
                var refer = req.session._loginReferer || '/';
                for (var i = 0; i < notJump.length; i++) {
                    if (refer.indexOf(notJump[i]) >= 0) {
                        refer = '/';
                        break;
                    }
                }
                res.redirect(refer);
            });
        }));
    });
};

/**
 * sign out
 */
exports.logout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.redirect('/');
};