var qn = require('qiniu');
var config = require('../config');

//qi niu client
var qnClient = null;
if (config.qn_access && config.qn_access.secretKey !== 'your secret key') {
    //qnClient = qn.create(config.qn_access);
    qn.conf.ACCESS_KEY = config.qn_access.accessKey;
    qn.conf.SECRET_KEY = config.qn_access.secretKey;
    var bucket = config.qn_access.bucket;

}

module.exports = qnClient;