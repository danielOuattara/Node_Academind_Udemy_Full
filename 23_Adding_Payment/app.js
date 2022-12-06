require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const errorController = require("./controllers/error");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const isAuth = require("./middlewares/isAuth");
const csrf = require("csurf");
const User = require("./models/user");
const flash = require("connect-flash");
const multer = require("multer");

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

const csrfProtection = csrf({}); // creating the middleware protection

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, "_" + Date.now() + "_" + file.originalname);
  },
});

app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use(express.static(path.join(__dirname, "public")));

// serving images statically
app.use("/images", express.static(path.join(__dirname, "images")));

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
  // globally send some required data, read in to know which is send !
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  //
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user; // here user is a full mongoose model: with all method and properties
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", isAuth, adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

// app.get("/500", errorController.get500);  // ? why here ?

// app.use(errorController.get500);
app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    editing: false,
    hasError: true,
  });
  // res.redirect("/500");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Database: success !");
    app.listen(3000, () =>
      console.log("App is running on port http://localhost:3000/"),
    );
  })
  .catch((err) => console.log(err));
