const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// comments schema
const promotionsSchema = new Schema({
      _pid: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
      }
  }, {timestamps: true});
//


// customer merchants relationship management schema
const CRM = new Schema({
      _cid: {                          // CProfile _id
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      _mid: {                          // MProfile _id
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      score: {
            type: Number,
            default: 0
      },
      vists:  {                           // number of visits or transactions
            type: Number,
            default: 0
      },
      distributedzarios: {                // distributed to customers 
            type: Number,
            default: 0
      },
      totalcommision: {                // total commision the application earned from this m2c
            type: Number,
            default: 0
      },
      totsales: {                // total sales the application made by this m2c
            type: Number,
            default: 0
      },
      timedpromotions: [promotionsSchema]
}, {timestamps: true});
//

module.exports = mongoose.model('CRM', CRM);