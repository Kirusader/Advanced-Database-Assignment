/** @format */
const bcrypt = require("bcrypt");
const User = require("../models/User");
const path = require("path");
exports.login = (req, res) => {
  res.render("login");
};
/** @format */

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username: username }, function (error, user) {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          req.session.userId = user._id;
          res.redirect("/");
        } else {
          res.redirect("/auth/login");
        }
      });
    } else {
      console.log("/auth/login::", user);
      res.redirect("/auth/login");
    }
  });
};

exports.createUser = (req, res) => {
  User.create(req.body, (error, user) => {
    if (error) {
      const validationErrors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      req.flash("validationErrors", validationErrors);
      req.flash("data", req.body);
      return res.redirect("/auth/register");
    }
    res.redirect("/");
  });
};
exports.newUser = (req, res) => {
  var username = "";
  var password = "";
  const data = req.flash("data")[0];

  if (typeof data != "undefined") {
    username = data.username;
    password = data.password;
  }

  res.render("register", {
    //errors: req.session.validationErrors
    errors: req.flash("validationErrors"),
    username: username,
    password: password,
  });
};
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
