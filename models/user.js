const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// password and user name are not mentioned explicitly since passport module takes care of them and imbeds them in the user table automatically  

const User = new Schema({
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
        unique: true, 
        trim:true
    },
    documentlocation: {                                     // document is either the merchants official registration or the customers CID/PASSPORT. documentlocation field is the address to the location of the documents image at AWS Storage.
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
    approvalstatus: {           // the values are 'pending' for merchants pending b4 document submission. 'submit' for after submitting documents & 'approved'  after document submit and verify the admin will approve the merchant for day2day operations. for customers if he does not send id it is 'pending' and 'submit' when he sends id and 'approved' after uploading cid or passport. for customer it is required only if he wants to buy zarios directly.
        type: String,
        default: 'pending'
    },
    lastsignondate: {
          type: Date,
          default: Date.now
    }
    // set by ADMIN---> permitted values:(ADMIN, CUSTOMER, MER%CHANT).
}, {timestamps: true});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);