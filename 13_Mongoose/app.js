require("dotenv").config();
const path = require("path");
const express = require("express");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6208db9bad6fc9fa11177cbc")
    .then((user) => {
      req.user = user; // here user is a full mongoose model: with all method and properties
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    return User.findOne();
  })
  .then((user) => {
    if (!user) {
      const user = new User({
        name: "Daniel",
        email: "daniel@email.com",
        cart: {
          items: [],
        },
      });
      return user.save();
    }
  })
  .then(() => {
    console.log("Connection to MongoDB database : SUCCESS ");
    app.listen(3000, () =>
      console.log("App is running on port http://localhost:3000/")
    );
  })
  .catch((err) => console.log(err));
// console.log("Connected to MongoDB Database: success !");s
