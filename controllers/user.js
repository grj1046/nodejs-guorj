var config = require('../config');
var UserProxy = require('../proxy').User;
var util = require('util');
var EventProxy = require('eventproxy');

exports.index = function (req, res, next) {
    var user_id = req.params.id;

    var ep = new EventProxy();
    ep.fail(next);
    ep.on('render_user', function (user) {
        res.render('user/index', {
            title: util.format("@%s 的个人主页", user.name || ''),
            user: user
        });
    });

    UserProxy.getUserById(user_id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.render404('用户不存在。');
            return;
        }
        ep.emit('render_user', user);
    });
};
