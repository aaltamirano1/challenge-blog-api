'use strict';
const mongoose  = require('mongoose');
//schema
//id created automatically, not needed in schema.
const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String, required: true}
});

blogPostSchema.virtual("authorString").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorString
  };
};

//
const BlogPost = mongoose.model("Post", blogPostSchema);

module.exports = {BlogPost};
