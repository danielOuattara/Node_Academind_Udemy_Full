require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const errorController = require("./controllers/errorControllers");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const isAuth = require("./middlewares/isAuth");
const csrf = require("csurf");
const User = require("./models/userModel");
const flash = require("connect-flash");

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

const csrfProtection = csrf({}); // creating the middleware protection

app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret string",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use(csrfProtection); // using the middleware protection, must be placed after a session
app.use(flash()); // for flash message, TODO: continue read the doc

app.use((req, res, next) => {
  //
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user; // here user is a full mongoose model: with all method and properties
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  // globally send some required data, read in to know which is send !
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", isAuth, adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Database: success !");
    app.listen(process.env.PORT, () =>
      console.log(
        `App is running on port http://localhost:${process.env.PORT}/`,
      ),
    );
  })
  .catch((err) => console.log(err));
