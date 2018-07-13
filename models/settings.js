var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Settings = new Schema({
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
            minlength: 3,
            maxlength:50,
            default:'Zario and The Black Diamond Loyalty Program'
      },
      avatar: { 
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
            minlength: 5,
            maxlength:20,
            lowercase: true
            },
      countrycode: {
            type: String, 
            required: true,
            default: ''
      },
      mobile: {
            type: String, 
            required: true
      },
      phone: {
            type: String, 
            required: true
      },
      nocustomers: {
            type: Number,
            default: null
      },
      nomerchants: {
         type: Number,
         default: null
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
      nobronze: {
      type: Number,
      default: null
      },
      nosilver: {
      type: Number,
      default: null
      },
      nogold: {
      type: Number,
      default: null
      },
      noplatinum: {
      type: Number,
      default: null
      },
      nopearl: {
      type: Number,
      default: null
      },
      noblackdiamond: {
      type: Number,
      default: null
      },
      distributedzarios: {
         type: Number,
         default: null
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