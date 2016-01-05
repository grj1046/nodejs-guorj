var config = {
  //debug为true时，用于本地调试
  debug: true,

  name: 'guorj blog',//社区名称
  description: '纸上得来终觉浅',//社区的描述
  keywords: 'nodejs, express, guorj blog, nil',

  host: 'localhost',
  //https://github.com/Automattic/mongoose/wiki/3.8-Release-Notes#connection-pool-sharing
  maindb: 'mongodb://127.0.0.1/guorj_blog_dev',//主数据库
  tmpdb_name: 'guorj_blog_dev_tmpdb',//临时数据库，即使该数据库丢了，网站也能正常运行

  session_secret: 'guorj_blog_secret',//务必修改
  auth_cookie_name: 'guorj_cn',

  //程序运行的端口
  port: 3000,

  //是否允许直接注册
  allow_sign_up: true,
  admins: [],

  qn_access: {
    accessKey: 'your access key',
    secretKey: 'your secret key',
    bucket: 'your bucket name',
    domain: 'http://your qiniu domain'
  }
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/guorj_blog_test';
}

module.exports = config;
