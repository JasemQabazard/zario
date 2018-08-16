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
    // set if there is a recruiting merchant for the user
    twofactorauth: {
        type: Boolean, 
        default:false
    },
    // set if the user selects to authenticate with two factor authentication
    role: {
        type: String,
        default: 'CUSTOMER'
    },
    // the users group _id before creating merchants profile 
    _gid: { 
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    // the MERCHANT set this merchants_id from the profile to limit working merchant for the user in the group
    // OR it is the =======recruiting merchant====== for customers
    _mid: { 
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    lastsignondate: {
          type: Date,
          default: Date.now
    }
    // set by ADMIN---> permitted values:(ADMIN, CUSTOMER, MER%CHANT).
}, {timestamps: true});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);