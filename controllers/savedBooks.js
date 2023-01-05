/** @format */
const User = require("../models/User");
exports.list = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const userRef = await User.findOne({ _id: user.id }).populate(
      "saved_books"
    );
    res.render("saved-books", { bookposts: userRef.saved_books });
  } catch (e) {
    console.log(e);
    res.json({ result: "could not find user faves" });
  }
};
