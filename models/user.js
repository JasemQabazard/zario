var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    emailid: { type: String, trim:true, default: '', lowercase:true },
    firstname: { type: String, default: '', trim: true, lowercase:true  },
    lastname: { type: String, default: '', trim: true, lowercase:true  },
    role:   {type: String,default: 'retailer'}
    // username: { type: String, required:true, unique:true, lowercase:true},
    // password: {type: String, required:true, minlength: 8},
    // emailid: { type: String, unique: true, trim:true, required:true, lowercase:true },
    // firstname: { type: String, default: '', trim: true, lowercase:true  },
    // lastname: { type: String, default: '', trim: true, lowercase:true  },
    // admin:   {type: String,default: ''}
}, {timestamps: true});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);