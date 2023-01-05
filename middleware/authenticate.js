/** @format */

const User = require("../models/User");

exports.auth = (req, res, next) => {
  User.findById(req.session.userId, (error, user) => {
    if (error || !user) return res.redirect("/");

    next();
  });
};
exports.validate = (req, res, next) => {
  if (req.body.authors == null || req.body.title == null) {
    return res.redirect("/posts/new");
  }
  next();
};
exports.redirect = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/");
  }
  next();
};
