var config = require('../config');
var EventProxy = require('eventproxy');
var mongoose = require('mongoose');
var User = require('../models').User;
var UserProxy = require('../proxy').User;

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
    if (!req.session.user) {
        return res.render('notify/notify', {
            title: "提示",
            error: "你还没有登录。"
        })
    }
    if (!req.session.user.is_admin) {
        return res.render('notify/notify', {
            title: "提示",
            error: "需要管理员权限。"
        })
    }
    next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(403).send("forbidden!");
    }
    next();
};
/**
 * 未登录提示登录
 */
exports.loginRequired = function (req, res, next) {
    if (!req.session || !req.session.user) {
        return res.render('notify/prompt', {
            title: '提示'
        });
    }
    next();
}
/**
 * 用户是否被屏蔽
 */
exports.blockUser = function () {
    return function (req, res, next) {
        if (req.path === '/signout') {
            return next();
        }

        if (req.session.user && req.session.user.is_block && req.method !== "GET") {
            return res.status(403).send('您已被管理员屏蔽。');
        }
        next();
    };
};
/**
 * 生成Session
 */
exports.gen_session = function (user, res) {
    var auth_token = user._id + "$$$$"; //以后可能会存储更多信息，用来$$$$分割

    var opts = {
        path: '/',
        maxAge: 900000, //1000 & 60 * 60 * 24 * 30,//30天 (单位：毫秒)
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts);
};
/**
 * 验证用户是否登录
 */
exports.authUser = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);

    //Ensure current_user always has defined.
    res.locals.current_user = null;

    ep.all('get_user', function (user) {
        if (!user) {
            return next();
        }
        user = res.locals.current_user = req.session.user = new User(user);

        if (config.admins.hasOwnProperty(user.nickname)) {
            user.is_admin = true;
        }
        next();
        //Message.getMessageCount();
    });

    if (req.session.user) {
        ep.emit('get_user', req.session.user)
    } else {
        var auth_token = req.signedCookies[config.auth_cookie_name];
        if (!auth_token) {
            return next();
        }
        var auth = auth_token.split('$$$$');
        var user_id = auth[0];
        UserProxy.getUserById(user_id, ep.done('get_user'));
    }
};
