var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mobile schema
var mobileSchema = new Schema({
      countrycode:  {type: String,default: ''},
      mobile:  {type: String,default: ''}
  }, {timestamps: true});
//
// zario schema
var zarioSchema = new Schema({
      zarios:  {type: Number,default: null},
      ukey:  {type: String,default: ''},
      rkey:  {type: String,default: ''}
  }, {timestamps: true});
//
// merchants schema
var merchantsSchema = new Schema({
      _id:   mongoose.Schema.Types.ObjectId,
      name:  {type: String,default: ''},
      score:  {type: Number,default: null}
  }, {timestamps: true});
//

var Customers = new Schema({
      user_id: { 
            type: mongoose.Schema.Types.ObjectId,
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
      mobile: [mobileSchema],
      zario: [zarioSchema],
      merchants: [merchantsSchema]
},{
   timestamps: true
});


module.exports = mongoose.model('Customers', Customers);