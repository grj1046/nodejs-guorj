//DEBUG=express:* node app.js

var config = require('./config');
var webRouter = require('./web_router');
var webapiRouterV1 = require('./webapi_router_v1');

var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var _ = require('lodash');
var auth = require('./middlewares/auth');
var errorPageMiddleware = require('./middlewares/error_page')
//静态文件目录
var staticDir = path.join(__dirname, 'public');

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

//configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

//静态资源
app.use('/public', express.static(staticDir));
//通用的中间件
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
//app.use(require('method-override'));
app.use(require('cookie-parser')(config.session_secret));
app.use(session({
    secret: config.session_secret,
    name: 'sid',//session id
    resave: true,
    saveUninitialized: true
}));

//custom middleware
app.use(auth.authUser);
app.use(auth.blockUser());

if (!config.debug) {
    //  app.use(function (req, res, next) {
    //    if (req,path.indexOf('/api') === -1) {
    //    }
    //  })
    app.set('view cache', true);
}

app.use(function (req, res, next) {
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});
// set static, dynamic helpers
// 全局的帮助函数或者变量
_.extend(app.locals, {
    config: config,
});

app.use(errorPageMiddleware.errorPage);
_.extend(app.locals, require('./common/render_helper'));
app.use('/', webRouter);
app.use('/api', webapiRouterV1);

//error handler
if (config.debug) {
    //打印mongodb查询日志
    require('./middlewares/mongoose_log');
} else {
    //全局异常捕获
    app.use(function (err, req, res, next) {
        console.error('server 500 error:', err);
        return res.status(500).send('500 status');
    });
}

app.listen(config.port, function () {
    console.log('guorj.cn listening on port', config.port);
    console.log('God bless love ...');
    console.log('You can debug your app with http://' + config.hostname + ':' + config.port);
    console.log('');
});

module.exports = app;
