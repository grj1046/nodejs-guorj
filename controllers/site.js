var config = require('../config');

exports.index = function (req, res, next) {
  //res.end('hello');
  res.render('index', {
//    config: config,
    title: 'titie'
  });
}
