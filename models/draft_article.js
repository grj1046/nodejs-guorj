var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DraftArticle = new Schema({
	user_id: { type: ObjectId },
	title: { type: String },
	content: { type: String },
	create_at: { type: Date, default: Date.now }
});

exports.DraftArticle = DraftArticle;