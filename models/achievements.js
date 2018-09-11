const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Achievements = new Schema({
      title: {
            type: String,
            required: true,
            trim: true
      },
      avatar: { 
            type: String,
            default: ''
      },
      description: {
            type: String,
            default: ''
      },
      done:  {
         type: Boolean,
         default: false
      },
      score: {
            type: Number,
            default: null
      }
},{
   timestamps: true
});

module.exports = mongoose.model('Achievements', Achievements);