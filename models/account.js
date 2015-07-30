var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var utility = require('utility');

var UserSchema = new Schema({
  loginname: { type: String },
  passhash: { type: String },
  accountType: { type: String },
  user_id: { type: String }
});

UserSchema.plugin(BaseModel);
//UserSchema.virtual('pass_confirm');

UserSchema.index({ loginname: 1}, { unique: true });

mongoose.model('Account', UserSchema);
