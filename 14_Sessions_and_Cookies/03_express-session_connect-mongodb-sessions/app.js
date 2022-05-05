require("dotenv").config();
const path = require("path");
const express = require("express");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret string",
    resave: false,
    saveUninitialized: false,
    // cookie config here also...
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  console.log(req.session);
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
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Daniel",
            email: "daniel@email.com",
            cart: {
              items: [],
            },
          });
          user.save();
        }
      })
      .catch((err) => console.log(err));
    console.log("Connected to MongoDB Database: success !");
    app.listen(3000, () =>
      console.log("App is running on port http://localhost:3000/")
    );
  })
  .catch((err) => console.log(err));
