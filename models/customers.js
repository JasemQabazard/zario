var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Customers = new Schema({
      username: { 
            type: String,
            required: true,
            unique: true
      },
      firstname: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      lastname: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      birthdate: {
            type: Date,
            default: Date.now
      },
      avatar: { 
            type: String,
            default: ''
      },
      city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
            },
      country: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      score: {
            type: Number,
            default: null
      },
      initialflag: {
            type: Boolean,
            default: false
      },
      zarios:  {
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
      },
      merchants: [mongoose.Schema.Types.ObjectId]
},{
   timestamps: true
});


module.exports = mongoose.model('Customers', Customers);