var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// comments schema
var commentsSchema = new Schema({
      user_id: { type: mongoose.Schema.Types.ObjectId, required: true},
      hearted:  {type: Boolean,default: false},
      comment:  {type: String,default: ''}
  }, {timestamps: true});
//

var Socials = new Schema({
      user_id: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
      medialink: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      hearts: {
         type: Number,
         default: null
      },
      postdate: {
         type: Date,
         default: Date.now
      },
      title: {
         type: String,
         default: ""
      },
      post: {
         type: String,
         default: ""
      },
      comments: [commentsSchema]
},{
   timestamps: true
});

module.exports = mongoose.model('Socials', Socials);