var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var utility = require('utility');

var AccountSchema = new Schema({
  loginname: { type: String },
  passhash: { type: String },
  email: { type: String },
  user_id: { type: String },
  active: { type: Boolean },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

AccountSchema.plugin(BaseModel);
//UserSchema.virtual('pass_confirm');

AccountSchema.index({ loginname: 1}, { unique: true });
AccountSchema.index({ email: 1 }, { unique: true });

mongoose.model('Account', AccountSchema);
