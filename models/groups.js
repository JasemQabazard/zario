var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Groups = new Schema({
      username: { 
            type: String,
            required: true,
            unique: true
      },
      name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      description: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      email: { 
            type: String, 
            trim:true, 
            required:true, 
            lowercase:true 
      },
      city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
            },
      countrycode: {
            type: String, 
            required: true
      },
      mobile:{
            type: String, 
            required: true
      },
      phone: {
            type: String, 
            required: true
      },
      merchants: [mongoose.Schema.Types.ObjectId]
},{
   timestamps: true
});

module.exports = mongoose.model('Groups', Groups);