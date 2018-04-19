var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var Profiles = new Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   description: { 
      type: String,
      required: true
   }
},{
   timestamps: true
});
//

module.exports = mongoose.model('Profiles', Profiles);