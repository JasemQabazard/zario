var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Profile = new Schema({
   profilename: String,
   profiledescription: String,
}, {timestamps: true});
//

module.exports = mongoose.model('Profile', Profile);