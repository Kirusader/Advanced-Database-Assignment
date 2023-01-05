/** @format */

require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const { PORT, MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
const app = new express();
const ejs = require("ejs");
const { resourceUsage } = require("process");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const flash = require("connect-flash");
const authMiddleware = require("./middleware/authenticate");
const User = require("./models/User");
app.set("view engine", "ejs");
global.loggedIn = null;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(fileUpload());
app.use("/posts/store", authMiddleware.validate);
app.use(
  expressSession({
    secret: "keyboard cat",
  })
);
app.use(flash());
app.use("*", async (req, res, next) => {
  loggedIn = req.session.userId;
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
});

app.listen(PORT, () => {
  console.log("App listening on port 4000");
});

const storePostController = require("./controllers/storePost");
const storeUserController = require("./controllers/storeUser");
const { resourceLimits } = require("worker_threads");
const searchApiController = require("./controllers/api/search");
const savedBooksApiController = require("./controllers/api/savedBooks");
const savedBooksController = require("./controllers/savedBooks");
app.get("/search-books", (req, res) => {
  res.render("search-books", searchApiController);
});
app.get("/saved-books", savedBooksController.list);

app.get("/api/search-books", searchApiController.list);
app.post("/api/saved-books", savedBooksApiController.create);
app.get("api/search");
app.get("/post", authMiddleware.auth, storePostController.list);
app.get("/delete/:id", authMiddleware.auth, storePostController.delete);
app.get("/update/:id", authMiddleware.auth, storePostController.edit);
app.post("/update/:id", authMiddleware.auth, storePostController.update);
app.get("/posts/new", authMiddleware.auth, storePostController.newpost);
app.post("/posts/store", authMiddleware.auth, storePostController.create);
app.get("/", storePostController.home);
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/post/:id", storePostController.getpost);
app.get("/posts/new", authMiddleware.auth, storePostController.newpost);
app.post("/posts/store", authMiddleware.auth, storePostController.create);
app.get("/auth/register", authMiddleware.redirect, storeUserController.newUser);
app.post(
  "/users/register",
  authMiddleware.redirect,
  storeUserController.createUser
);

app.get("/auth/login", authMiddleware.redirect, storeUserController.login);

app.post(
  "/users/login",
  authMiddleware.redirect,
  storeUserController.loginUser
);

app.get("/auth/logout", storeUserController.logout);

app.use((req, res) => {
  res.render("notfound");
});
