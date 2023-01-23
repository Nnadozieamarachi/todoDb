const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    activity: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
