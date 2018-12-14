const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Zario = new Schema({
      _fid: { // from _id null for system and application zario dispursment and the _mid if from merchant 
            type: mongoose.Schema.Types.ObjectId, // and from _cid if from customer to customer 
            required: true,
            defaul: null
      },
      _toid: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true
      },
      participants: {
         type: String,
         default: 'a2m'             // a2m a2c m2c m2m c2m c2c
      },
      description: {
         type: String,
         default: ''             // zario transaction description
      },
      quantity: {
         type: Number,
         default: null
      },
      price: {                     // the current price of a zario
         type: Number,
         default: null
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


module.exports = mongoose.model('Zario', Zario);