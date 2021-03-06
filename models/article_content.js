var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ArticleContentSchema = new Schema({
    article_id: { type: ObjectId }, //Article表的Id
    content: { type: String },
    deleted: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

ArticleContentSchema.plugin(BaseModel);
ArticleContentSchema.index({ article_id: 1 });

//mongoose.model('Article_content', ArticleContentSchema);
exports.ArticleContentSchema = ArticleContentSchema;