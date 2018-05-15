var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Settings = new Schema({
      user_id: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      avatar: { 
            type: String,
            default: ''
      },
      emailid: { 
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
      country: {
            type: String,
            default: ''
      },
      nocustomers: {
            type: Number,
            default: null
      },
      nomerchants: {
         type: Number,
         default: null
      },
      // VALUE: is for calculating band/ levels/ reputations by amounts where as NUMBER is calculating it by the number of certain items purchased like the way coffee shops do it
      strategy: {
            type: String,
            default: "VALUE"
      },
      bronze: {
         type: Number,
         default: null
      },
      silver: {
         type: Number,
         default: null
      },
      gold: {
         type: Number,
         default: null
      },
      platinum: {
         type: Number,
         default: null
      },
      pearl: {
         type: Number,
         default: null
      },
      blackdiamond: {
         type: Number,
         default: null
      },
      distributedzarios: {
         type: Number,
         default: null
      },
      mobile: {
            countrycode: {type: Number, required: true},
            number:{type: Number, required: true}
      },
      phone: {
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
      }
},{
   timestamps: true
});

module.exports = mongoose.model('Settings', Settings);