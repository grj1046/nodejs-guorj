var config = require('../config');

exports.index = function (req, res, next) {
  var userName = req.params.name;
  res.render('user/index', {
    title: "主页"
  })
  next();
}
