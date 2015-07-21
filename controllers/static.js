
//static page
//about
exports.about = function (req, res, next) {
  res.render('static/about', {
    title: '关于我们'
  });
};

//FAQ
exports.faq = function (req, res, next) {
  res.render('static/faq', {
    title: 'FAQ'
  });
};

exports.robots = function (req, res, next) {
  res.type('text/plain');
  res.send('User-Agent: * \r\n Disallow: /');
};
