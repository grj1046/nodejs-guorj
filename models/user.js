var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  profile_image_url: { type: String },
  signature: { type: String },
  profile: { type: String },
  avatar: { type: String },
  is_block: { type: Boolean, default: false },

  score: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  access_token: {type: String }
});

UserSchema.plugin(BaseModel);
//虚拟属性
UserSchema.virtual('avatar_url').get(function () {
  var url = this.avatar;
  return url;
});
//index
UserSchema.index({ user_id: 1}, { unique: true });
UserSchema.index({ email: 1}, { unique: true });
UserSchema.index({ access_token: 1});

mongoose.model('User', UserSchema);
