var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// password and user name are not mentioned explicitly since passport module takes care of them and imbeds them in the user table automatically  

var User = new Schema({
    email: { 
        type: String, 
        unique: true, 
        trim:true, 
        lowercase:true 
    },
    firstname: {
        type: String, 
        default: ''
    },
    lastname:{
        type: String, 
        default: ''
    },
    countrycode: {
        type: String, 
        default: ''
    },
    mobile:{
        type: String, 
        default: ''
    },
    recruitingmerchant: { 
        type: String, 
        default: '', 
        trim: true, 
        lowercase:true
    },
    // set if there is a recruiting merchant for the user
    twofactorauth: {
        type: Boolean, 
        default:false
    },
    // set if the user selects to authenticate with two factor authentication
    role: {
        type: String,
        default: 'CUSTOMER'
    }
    // set by ADMIN---> permitted values:(ADMIN, CUSTOMER, MER%CHANT).
}, {timestamps: true});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);