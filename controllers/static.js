var path = require('path');
//static page
//about
exports.about = function (req, res, next) {
    res.render('static/about', {
        title: '关于'
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

exports.favicon = function (req, res, next) {
    res.sendFile(path.join(__dirname, "..", "public", "favicon.ico"));
}