var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Customers = new Schema({
      user_id: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true
      },
      firstname: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      lastname: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      birthdate: {
            type: Date,
            default: Date.now
      },
      avatar: { 
            type: String,
            default: ''
      },
      emailid: { 
            type: String, 
            unique: true, 
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
      country: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      score: {
            type: Number,
            default: null
      },
      initialflag: {
            type: Boolean,
            default: false
      },
      mobile: {
            countrycode: {type: Number, required: true},
            number:{type: Number, required: true}
      },
      zarios:  {
            type: Number,
            default: null
      },
      ukey:  {
            type: String,
            default: ''
      },
      rkey:  {
            type: String,
            default: ''
      },
      merchants: [mongoose.Schema.Types.ObjectId]
},{
   timestamps: true
});


module.exports = mongoose.model('Customers', Customers);