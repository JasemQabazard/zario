const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Trans = new Schema({
      _cid: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      _mid: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true
      },
      timingcode: {
            type: String,
            default: ''       // if hourly, daily, weekly, monthly then it should be applioed once only during the period under consideration
      },
      appliedpromotions: [
            { 
            _pid: { 
                  type: mongoose.Schema.Types.ObjectId,
                  required: true
                  },
            discount: {
                  type: Number,
                  default: ""
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
                  }
            }
      ],
      amount: {
         type: Currency,
         default: null
      },
      discount: {
            type: Number,
            default: null
      },
      meritsonpurchase: {
            type: Number,
            default: 0,
            min: 0
      },
      merits: {
            type: Number,
            default: 0,
            min: 0
      },
      zarios: {
            type: Number,
            default: null
      },
      description: {
            type: String,
            trim: true,
            lowercase: true
      },
      // business category ---> product category with the purpose of using AI to advance the customer story with the application 
      category: { 
         type: String,
         default: ''
      }
},{
   timestamps: true
});


module.exports = mongoose.model('Trans', Trans);