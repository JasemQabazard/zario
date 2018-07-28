var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// comments schema
var commentsSchema = new Schema({
      username: { type: String, required: true },
      name: {type: String},
      comment:  {type: String, default: ''}
  }, {timestamps: true});
//

var Promotions = new Schema({
      _mid: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      avatar: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      narrative : {
            type: String,
            trim: true,
            lowercase: true
      },
      hearts: {
         type: Number,
         default: null
      },
      // usernames who like the promotion
      hearted:[String],
  // {"All"},===========> all customers, non customers
  // {"Customer"},======> customers only where level is all or a certain band
  // {"Daily"},=========> Its a deily purchasing quest randomly gigen to a customer restircted to a time period of 24 hours
  // {"Game"},==========> Its a winable item in a non Hunt game like scratch and win 
  // {"Hunt"},==========> Its winnable in a the treasure Hunt game 
  // {"Initial"},=======> Initial Customer Sign on deal
  // {"Level"},=========> its a Level jump reward if level is all then all jumps are rewarded if level set to band then only jumping from that band is rewarded
  // {"Monthly"},=======> its offered for a month only 
  // {"Weekly"},========> its offered for a week only 
      genre: { 
         type: String,
         default: '',
         required: true
      },
      // All / Bronze/ Silver/ Gold/ Platinum/ Pesrl/ Blackdiamond
      level: { 
         type: String,
         default: '',
         required: true
      },
      // All, Zario, Prodcut, Service, Purchase
      category: { 
            type: String,
            default: '',
            required: true
         },
      // date range will hold start date and end date
      daterange: [Date],
      discount: {
            type: String,
            default: ""
      },
      price: {
            type: Currency,
            default: null,
            min: 0
      },
      description: {
         type: String,
         default: ""
      },
      comments: [commentsSchema]
},{
   timestamps: true
});

module.exports = mongoose.model('Promotions', Promotions);