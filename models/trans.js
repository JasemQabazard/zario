var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var Trans = new Schema({
      customer_id: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      merchant_id: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true
      },
      promotion_id: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true
      },
      score: {
         type: Currency,
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