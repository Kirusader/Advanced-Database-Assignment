/** @format */
/** @format */

const BookPost = require("../models/BookPost");
const path = require("path");
const User = require("../models/User");
exports.home = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;

  //const bookposts = await BookPost.find({}).populate("userid");
  const totlBooks = await BookPost.find({}).count();
  const totalAuthors = await BookPost.aggregate([
    { $group: { _id: "$authors", total: { $sum: 1 } } },
    { $count: "total" },
  ]);
  try {
    const bookposts = await BookPost.find({})
      .skip(perPage * page - perPage)
      .limit(limit);
    const count = await BookPost.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);
    res.render("index", {
      bookposts: bookposts,
      totlBooks: totlBooks,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message,
      totalAuthors: totalAuthors[0].total,
    });
  } catch (e) {
    res.status(404).send({ message: "could not list books." });
  }
};
exports.newpost = (req, res) => {
  if (req.session.userId) {
    return res.render("create", {
      createPost: true,
    });
  }
  res.redirect("/auth/login");
};

exports.getpost = async (req, res) => {
  const bookpost = await BookPost.findById(req.session.userId).populate(
    "userid"
  );
  res.render("post", {
    bookpost,
  });
};

exports.create = async (req, res) => {
  try {
    const bookpost = new BookPost({
      title: req.body.title,
      authors: req.body.authors,
      average_rating: req.body.average_rating,
      isbn: req.body.isbn,
      text_reviews_count: req.body.text_reviews_count,
      publication_date: req.body.publication_date,
      publisher: req.body.publisher,
      userid: req.session.userId,
    });
    await bookpost.save();
    res.redirect("/");
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render("create", { errors: e.errors });
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
};
exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;
  const totlBooks = await BookPost.find({}).count();
  const totalAuthors = await BookPost.aggregate([
    { $group: { _id: "$authors", total: { $sum: 1 } } },
    { $count: "total" },
  ]);
  try {
    const user = await User.findById(req.session.userID);
    const bookpost = await BookPost.find({})
      .skip(perPage * page - perPage)
      .limit(limit);
    const count = await BookPost.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);
    res.render("post", {
      bookpost: bookpost,
      totlBooks: totlBooks,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message,
      user: user,
      totalAuthors: totalAuthors[0].total,
    });
  } catch (e) {
    res.status(404).send({ message: "could not list books." });
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await BookPost.findByIdAndRemove(id);
    res.redirect("/post");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const bookpost = await BookPost.findById(id);
    res.render("update", { bookpost: bookpost, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could not find bookpost${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const bookpost = await BookPost.findByIdAndUpdate({ _id: id }, req.body);
    res.redirect("/post");
  } catch (e) {
    res.status(404).send({
      message: `could not find bookpost${id}.`,
    });
  }
};
