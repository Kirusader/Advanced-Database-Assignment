/** @format */
const User = require("../../models/User");
exports.create = async (req, res) => {
  const id = req.body.id;
  console.log(id);
  if (!id || req.session.userID) {
    res.json({ result: "error" });
  }
  try {
    await User.update(
      { _id: req.session.userID },
      { $push: { saved_books: id } }
    );
  } catch (e) {
    res.json({ result: "error could not create a favourite" });
  }
};
