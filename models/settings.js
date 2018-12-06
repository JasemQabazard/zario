const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Settings = new Schema({
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
            default: 0
      },
      nomerchants: {
         type: Number,
         default: 0
      },
      bronze: {
         type: Number,
         default: 0
      },
      silver: {
         type: Number,
         default: 0
      },
      gold: {
         type: Number,
         default: 0
      },
      platinum: {
         type: Number,
         default: 0
      },
      pearl: {
         type: Number,
         default: 0
      },
      blackdiamond: {
         type: Number,
         default: 0
      },
      cbronze: {
            type: Number,
            default: 0
      },
      csilver: {
            type: Number,
            default: 0
      },
      cgold: {
            type: Number,
            default: 0
      },
      cplatinum: {
            type: Number,
            default: 0
      },
      cpearl: {
            type: Number,
            default: 0
      },
      cblackdiamond: {
            type: Number,
            default: 0
      },
      zariosmultiplier: {                // multiplier x amount of purchase for awarding application 
            type: Number,                // zarios to customer and merchant according to the investment 
            default: 0                   // spread sheet
      },
      mdistributedzarios: {                // distributed to merchants 
            type: Number,
            default: null
      },
      cdistributedzarios: {                // distributed to customers 
         type: Number,
         default: null
      },
      zarios:  {                          // owned by the application
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