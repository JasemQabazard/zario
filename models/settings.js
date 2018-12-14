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
      zariosprice: {                      // price of a zario is usd
            type: Number,
            default: 0.75
      },
      zariosdistributionratio: {         // distribution ratio of zarios to merchants/ customers/ & APP
            type: Number,                // the lesser of (.15 x commision or .15 / zarioprice) 
            default: 0.15                 // as a part of the 1$ commision or .035% of purchase 
      },
      commission: {
            type: Number,                //  the 1$ commision or .035% of purchase which ever is less
            default: 0.035      
      },
      mdistributedzarios: {                // distributed to merchants 
            type: Number,
            default: 0
      },
      cdistributedzarios: {                // distributed to customers 
         type: Number,
         default: 0
      },
      zarios:  {                          // My Ownership of zario coins
            type: Number,                 // starts at a Million.
            default: 1000000
      },
      notrans: {                          // number of total transactions by app
            type: Number,
            default: 0
      },
      totcommissions: {                          // total commission by application
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

module.exports = mongoose.model('Settings', Settings);