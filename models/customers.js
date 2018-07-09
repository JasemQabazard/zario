var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Customers = new Schema({
      username: { 
            type: String,
            required: true,
            unique: true
      },
      birthdate: {
            type: Date,
            default: Date.now
      },
      gender: {
            type: String,
            required: true
      },
      social: {
            type: String,
            default: ""
      },
      occupation: {
            type: String,
            default: ""
      },
      education: {
            type: String,
            default: ""
      },
      work: {
            type: String,
            default: ""
      },
      avatar: { 
            type: String,
            default: ''
      },
      score: {
            type: Number,
            default: 0
      },
      initialflag: {
            type: Boolean,
            default: false
      },
      zarios:  {
            type: Number,
            default: 0
      },
      ukey:  {
            type: String,
            default: ''
      },
      rkey:  {
            type: String,
            default: ''
      },
      merchants: [mongoose.Schema.Types.ObjectId]
},{
   timestamps: true
});


module.exports = mongoose.model('Customers', Customers);