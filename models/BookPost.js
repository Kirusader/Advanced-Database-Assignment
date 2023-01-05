/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookPostSchema = new Schema({
  title: { type: String, required: [true, "Book title is required"] },
  authors: { type: String, required: [true, "Book authors is required"] },
  average_rating: Number,
  isbn: { type: Number, required: [true, "Book isbn number is required"] },
  text_reviews_count: Number,
  publication_date: Date,
  publisher: String,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  datePosted: {
    type: Date,
    default: new Date(),
  },
});
BookPostSchema.index({ "$**": "text" });
const BookPost = mongoose.model("BookPost", BookPostSchema);
module.exports = BookPost;
