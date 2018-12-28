const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// comments schema
const commentsSchema = new Schema({
      username: { type: String, required: true },
      name: {type: String},
      comment:  {type: String, default: ''}
  }, {timestamps: true});
//

const Promotions = new Schema({
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
      generated: {
            type: Boolean,
            default: false,
      },
      duplicatable: {
            type: Boolean,
            default: false,
      },
      activity: {
            type: Boolean,
            default: false,
      },
      hearts: {
         type: Number,
         default: null
      },
      // usernames who like the promotion
      hearted:[String],
  //
  // ==========> timing restriction (initial hourly daily weekly monthly )
  //
      timing: { 
         type: String,
         default: '',
         required: true
      },
      // ==========> Action (hunt initial hurchase hollow heveling hame)
      action: { 
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
      // All, Zario, Prodcut, Service
      category: { 
            type: String,
            default: '',
            required: true
         },
      // date range will hold start date and end date
      daterange: [Date],
      discount: {
            type: Number,
            default: 0
      },
      meritsonpurchase: {
            type: Boolean,
            default: false,
      },
      merits: {
            type: Number,
            default: 0,
            min: 0
      },
      zarios: {
            type: Number,
            default: 0,
            min: 0
      },
      productservicecode: {
            type: String,
            default: ""
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