'use strict';
const mongoose  = require('mongoose');
//schema
//id created automatically, not needed in schema.
const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    unique: true
  }
});

const commentSchema = mongoose.Schema({content: String});

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  content: {type: String, required: true},
  comments: [commentSchema]
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.virtual('authorName').get(function(){
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model("Post", blogPostSchema);

module.exports = {Author, BlogPost};
