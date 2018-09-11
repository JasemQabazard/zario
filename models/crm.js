const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// customer merchants relationship management schema
const CRM = new Schema({
   _cid: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true
   },
   _mid: { 
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
   }
}, {timestamps: true});
//

module.exports = mongoose.model('CRM', CRM);