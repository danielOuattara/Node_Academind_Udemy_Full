require("dotenv").config();
const path = require("path");
const express = require("express");
const errorController = require("./controllers/errorControllers");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000, () =>
  console.log("app is runnning on : http://localhost:3000/")
);

/* For database connection testing only 
----------------------------------------*/
// const db = require("./utils/database");
// db.execute("SELECT * FROM products")
//   .then((result) => {
//     console.log(result[0]);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
