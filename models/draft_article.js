var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DraftArticle = new Schema({
    user_id: { type: ObjectId },
    title: { type: String },
    content: { type: String },
    create_at: { type: Date, default: Date.now }
});

DraftArticle.plugin(BaseModel);

exports.DraftArticle = DraftArticle;