var mongoose = require('mongoose');
var tools = require('../common/tools');

var traceMQuery = function (method, info, query) {
    return function (err, result, millis) {
        if (err) {
            console.log('traceMQuery error', err);
        }
        var infos = [];
        infos.push("=============" + tools.formatDate(new Date()) + "==================");
        infos.push("Method => " + query.mongooseCollection.name + "." + method + "()");
        infos.push("Info   => " + JSON.stringify(info));
        infos.push("MS     => " + millis + "ms");
        console.log("Mongo:", infos.join('\r\n') + '\r\n');
    };
};

mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery);
mongoose.set('debug', true);