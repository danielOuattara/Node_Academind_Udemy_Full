require("dotenv").config();
const path = require("path");
const express = require("express");
const errorController = require("./controllers/errorControllers");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const usersTestData = require("./data/usersTest.json");
const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
    // cookie config here also:
    //...
    store: store,
  }),
);

app.use((req, res, next) => {
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

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connexion Successfull to MongoDB Atlas !");
    return User.find();
  })
  .then((users) => {
    if (users.length === 0) {
      // initializing users for development
      return usersTestData.map((person) => {
        const { name, email } = person;
        return User.create({ name, email });
      });
    } else {
      return users;
    }
  })
  .then(() => {
    return app.listen(3000);
  })
  .then(() => console.log("App is running over http://localhost:3000/"))
  .catch((err) => console.log(err));
