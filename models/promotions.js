var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// merchants schema
var commentsSchema = new Schema({
      user_id: { type: mongoose.Schema.Types.ObjectId, required: true},
      hearted:  {type: Boolean,default: false},
      comment:  {type: String,default: ''}
  }, {timestamps: true});
//

var Promotions = new Schema({
      merchant_id: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      medialink: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      hearts: {
         type: Number,
         default: null
      },
      // promotion type DAILY: daily promotions will have a time remaining clock attached to them to place a little urgency on the offerLEVEL: the level promotion is used for regular purchases of a customer when he is at a certain level INITIAL: is a promotion to encourage a customer to come in and follow the retail merchant
      type: { 
         type: String,
         default: ''
      },
      // BRONZE/ SILVER/ GOLD/ PLATINUM/ PEARL/ BLACKDIAMOND
      level: { 
         type: String,
         required: true
      },
      // business category ---> Product category is finer than the business category.
      category: { 
         type: String,
         default: ''
      },
      startdate: {
         type: Date,
         default: Date.now
      },
      enddate: {
         type: Date,
         default: Date.now
      },
      discount: {
            type: String,
            default: ""
      },
      price: {
            type: Currency,
            default: null
      },
      description: {
         type: String,
         default: ""
      },
      post: {
         type: String,
         default: ""
      },      
      comments: [commentsSchema]
},{
   timestamps: true
});

module.exports = mongoose.model('Promotions', Promotions);