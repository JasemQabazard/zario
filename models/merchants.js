var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mobile schema
var mobileSchema = new Schema({
      countrycode:  {type: String,default: ''},
      mobile:  {type: String,default: ''}
  }, {timestamps: true});
//
// zario schema
var zarioSchema = new Schema({
      zarios:  {type: Number,default: null},
      ukey:  {type: String,default: ''},
      rkey:  {type: String,default: ''}
  }, {timestamps: true});
//
// merchants schema
var locationSchema = new Schema({
      longitude:  {type: String,default: ''},
      latitude:  {type: String,default: ''}
  }, {timestamps: true});
//

var Merchants = new Schema({
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
            required: true,
            trim: true,
            lowercase: true
      },
      score: {
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
      mobile: [mobileSchema],
      phone: [mobileSchema],
      location: [locationSchema],
      zario: [zarioSchema]
},{
   timestamps: true
});


module.exports = mongoose.model('Merchants', Merchants);