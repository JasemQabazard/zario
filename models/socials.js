const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// comments schema
const commentsSchema = new Schema({
      username: { type: String, required: true },
      name: {type: String},
      comment:  {type: String, default: ''},
      hearts: {
            type: Number,
            default: null
      },
      // usernames who LOVE the comment
      hearted:[String],
      hates: {
            type: Number,
            default: null
      },
      // usernames who HATE the comment
      hated:[String],
  }, {timestamps: true});
//

const Socials = new Schema({
      username: { 
            type: String,
            required: true
      },
      media: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      category: {
            type: String,
            lowercase: true
      },
      hearts: {
         type: Number,
         default: 0
      },
      // usernames who LOVE the blog post
      hearted:[String],
      hates: {
            type: Number,
            default: 0
      },
      // usernames who HATE the blog post
      hated:[String],
      title: {
         type: String,
         default: ""
      },
      post: {
         type: String,
         default: ""
      },
      access: {
            allcustomerslevel: {
                  type: String,
                  default: 'NO ACCESS'
               },
            allmerchantslevel: {
                  type: String,
                  default: 'NO ACCESS'
               },
            onlymerchantmemberslevel: {
                  type: String,
                  default: 'NO ACCESS'
               }
           },
      comments: [commentsSchema]
},{
   timestamps: true
});

module.exports = mongoose.model('Socials', Socials);