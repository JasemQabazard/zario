const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Groups = new Schema({
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
      score: {
            type: Number,
            default: 0
         },
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
      cdistributedzarios: {                // distributed to customers 
            type: Number,
            default: 0
      },
      notrans: {
            type: Number,
            default: 0
      },
      totalcommision: {                // total commision the application earned from this merchant
            type: Number,
            default: 0
      },
      totsales: {                // total sales the application made by this merchant
            type: Number,
            default: 0
      },
      cdistributedzarios_ytd: {                // distributed to customers 
            type: Number,
            default: 0
      },
      notrans_ytd: {
            type: Number,
            default: 0
      },
      totalcommision_ytd: {                // total commision the application earned from this merchant
            type: Number,
            default: 0
      },
      totsales_ytd: {                // total sales the application made by this merchant
            type: Number,
            default: 0
      }
},{
   timestamps: true
});

module.exports = mongoose.model('Groups', Groups);