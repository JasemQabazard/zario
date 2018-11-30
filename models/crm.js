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
   // number of visits
   vists:  {
         type: Number,
         default: 0
   },
   timedpromotions: [promotionsSchema]
}, {timestamps: true});
//

module.exports = mongoose.model('CRM', CRM);