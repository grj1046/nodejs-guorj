var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
	title: { type: String },
	summary: { type: String },
	author_id: { type: ObjectId }, //对应User表的id
	content_id: { type: ObjectId }, //当前文章内容的ID(Article_content)
	deleted: { type: Boolean, default: false },
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now }
});

ArticleSchema.plugin(BaseModel);
ArticleSchema.index({ title: 1 });
ArticleSchema.index({ author_id: 1 });

mongoose.model('Article', ArticleSchema);