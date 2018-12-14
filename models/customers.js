const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Customers = new Schema({
      username: { 
            type: String,
            required: true,
            unique: true
      },
      birthdate: {
            type: Date,
            default: Date.now
      },
      gender: {
            type: String,
            required: true,
            defaul: 'U'
      },
      social: {
            type: String,
            default: ""
      },
      occupation: {
            type: String,
            default: ""
      },
      education: {
            type: String,
            default: ""
      },
      work: {
            type: String,
            default: ""
      },
      avatar: { 
            type: String,
            default: ''
      },
      score: {
            type: Number,
            default: 100
      },
      notrans: {
            type: Number,
            default: 0
      },
      totpurchase: {
            type: Number,
            default: 0
      },
      totcommissions: {
            type: Number,
            default: 0
      },
      // set === true if created by merchant - once customer and system amends to falkse and changes the customer role ===> CUSTOMER and asks to verify user email as well 
      initialflag: {
            type: Boolean,
            default: false
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


module.exports = mongoose.model('Customers', Customers);