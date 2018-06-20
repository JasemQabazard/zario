var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Merchants = new Schema({
      username: { 
            type: String,
            required: true
      },
      name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      group_id: {
         type: mongoose.Schema.Types.ObjectId
      },
      // referral within the gorup only or between merchants except with similar categories
      referral: {
            type: Boolean,
            default: true
      },
      avatar: { 
            type: String,
            default: ''
      },
      // business category ---> similar business category are excluded from referral program if 2 merchants have "CAFE" category then customers recruited by one of them will not be referred to the other one. EXCEPT: the customer can EXPLICITLY ask to join the other within the APP. 
      category: { 
         type: String,
         default: ''
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
      // merchant score with the application that determines his band at application level
      score: {
            type: Number,
            default: 0
      },
      // VALUE: is for calculating band/ levels/ reputations by amounts where as 
      // NUMBER is calculating it by the number of certain items purchased like the way coffee shops do it
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
      longitude:  {
            type: String,
            default: ''
      },
      latitude:  {
            type: String,
            default: ''
      },
      zarios:  {
            type: Number,
            default: 0
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


module.exports = mongoose.model('Merchants', Merchants);