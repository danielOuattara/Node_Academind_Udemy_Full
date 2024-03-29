require("dotenv").config();
const path = require("path");
const express = require("express");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  User.findById("6284953788670f63dd891915")
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
      console.log("App is running on port http://localhost:3000/"),
    );
  })
  .catch((err) => console.log(err));
