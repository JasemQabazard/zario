var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Groups = new Schema({
      user_id: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true
      },
      name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      description: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 1
      },
      startdate: {
            type: Date,
            default: Date.now
      },
      avatar: { 
            type: String,
            default: ''
      },
      emailid: { 
            type: String, 
            unique: true, 
            trim:true, 
            required:true, 
            lowercase:true 
      },
      city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
            },
      country: {
            type: String,
            default: 0
      },
      referral: {
            type: Boolean,
            default: true
      },
      mobile: {
            countrycode: {type: Number, required: true},
            number:{type: Number, required: true}
      },
      phone: {
            countrycode: {type: Number, required: true},
            number:{type: Number, required: true}
      },
      merchants: [mongoose.Schema.Types.ObjectId]
},{
   timestamps: true
});

module.exports = mongoose.model('Groups', Groups);