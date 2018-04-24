var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mobile schema
var mobileSchema = new Schema({
      countrycode:  {type: String,default: ''},
      mobile:  {type: String,default: ''}
  }, {timestamps: true});
//

// merchants schema
var merchantsSchema = new Schema({
      _id:   mongoose.Schema.Types.ObjectId,
      name:  {type: String,default: ''},
      zarios:  {type: Number,default: null}
  }, {timestamps: true});
//

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
      zarios: {
            type: Number,
            defaults: null
      },
      referral: {
            type: Boolean,
            default: true
      },
      mobile: [mobileSchema],
      phone: [mobileSchema],
      merchants: [merchantsSchema]
},{
   timestamps: true
});

module.exports = mongoose.model('Groups', Groups);